import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Employee } from '../entities/employee.entity';
import IEmployeeRepository from '../repositories/employee/employee.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { CreateEmployeeFileDTO } from '../dtos/employee/createEmployeeFile.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';
import { PinService } from './pin.service';
import { EmployeesOnPinService } from './employeesOnPin.service';
import { ETypeCreationPin, ETypeEditionPin, ETypePin } from '../utils/ETypes';
import { Pin } from '../entities/pin.entity';
import * as XLSX from 'xlsx';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { json } from 'stream/consumers';

const validateAsync = (schema: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    validate(schema, { validationError: { target: false } })
      .then((response) => resolve(response.map((i) => i)))
      .catch((error: any) => reject(error));
  });
};
interface abc {
  line: number;
  employee: CreateEmployeeFileDTO;
}

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(forwardRef(() => EmployeesOnPinService))
    private readonly employeeOnPinService: EmployeesOnPinService,
    @Inject(forwardRef(() => PinService))
    private readonly pinService: PinService,
  ) {}

  async create(props: CreateEmployeeDTO): Promise<Employee> {
    let pin: Pin;

    const registrationExists = await this.employeeRepository.findByRegistration(
      props.registration,
    );

    if (registrationExists) {
      throw new HttpException(
        'Matrícula já cadastrada para outro(a) colaborador(a)!',
        HttpStatus.CONFLICT,
      );
    }

    if (props.pin.typeCreation === ETypeCreationPin.IS_EXISTENT) {
      if (!props.pin.id)
        throw new HttpException(
          'O id do ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
          HttpStatus.BAD_REQUEST,
        );
    } else if (props.pin.typeCreation === ETypeCreationPin.IS_NEW) {
      const { title, local, details, lat, lng } = props.pin;

      if (!title || !local || !details || !lat || !lng) {
        throw new HttpException(
          'Todas as informações são obrigatórias para cadastrar um colaborador a um ponto de embarque inexistente: title, local, details, lat, lng',
          HttpStatus.BAD_REQUEST,
        );
      }

      pin = await this.pinService.create({
        title,
        local,
        details,
        lat,
        lng,
      });
    }

    const dataPassword = bcrypt.hashSync(props.registration, 10);

    const employee = await this.employeeRepository.create(
      new Employee({
        ...props,
        password: dataPassword,
        address: JSON.stringify(props.address),
      }),
    );

    await this.employeeOnPinService.associateEmployee({
      employeeId: employee.id,
      pinId:
        props.pin.typeCreation === ETypeCreationPin.IS_EXISTENT
          ? props.pin.id
          : pin.id,
      type: ETypePin.CONVENTIONAL,
    });
    const { password, ...data } = employee;

    return { ...data, address: JSON.parse(data.address) };
  }

  async findByRegistration(registration: string): Promise<Employee> {
    const employee = await this.employeeRepository.findByRegistration(
      registration,
    );

    if (!employee)
      throw new HttpException(
        'Colaborador(a) não foi encontrado(a)!',
        HttpStatus.NOT_FOUND,
      );

    return employee;
  }

  async delete(id: string): Promise<Employee> {
    const employee = await this.listById(id);

    const data = await this.employeeRepository.delete(employee.id);

    return { ...data, address: JSON.parse(data.address) };
  }

  async listById(id: string): Promise<MappedEmployeeDTO> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee)
      throw new HttpException(
        'Colaborador(a) não foi encontrado(a)!',
        HttpStatus.NOT_FOUND,
      );

    return this.mapperOne(employee);
  }

  async listAll(
    page: Page,
    filters?: FiltersEmployeeDTO,
  ): Promise<PageResponse<MappedEmployeeDTO>> {
    const employees = await this.employeeRepository.findAll(page, filters);

    if (employees.total === 0) {
      throw new HttpException(
        'Não existe colaborador(a) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.mapperMany(employees.items);

    return {
      total: employees.total,
      items,
    };
  }

  async update(
    id: string,
    data: UpdateEmployeeDTO,
  ): Promise<MappedEmployeeDTO> {
    const employee = await this.listById(id);
    let pin: Pin;

    if (data.registration) {
      const registrationExists =
        await this.employeeRepository.findByRegistration(data.registration);

      if (
        registrationExists &&
        registrationExists.registration !== employee.registration
      ) {
        throw new HttpException(
          'Matrícula já cadastrada para outro(a) colaborador(a)!',
          HttpStatus.CONFLICT,
        );
      }
    }
    if (data.pin) {
      if (data.pin.typeEdition === ETypeEditionPin.IS_EXISTENT) {
        if (!data.pin.id)
          throw new HttpException(
            'O ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
            HttpStatus.BAD_REQUEST,
          );

        await this.employeeOnPinService.delete(
          employee.id,
          employee.pins[0].id,
        );

        await this.employeeOnPinService.associateEmployeeByService(
          data.pin.id,
          employee,
        );
      } else if (data.pin.typeEdition === ETypeEditionPin.IS_NEW) {
        const { title, local, details, lat, lng } = data.pin;

        if (!title || !local || !details || !lat || !lng) {
          throw new HttpException(
            'Todas as informações são obrigatórias para editar um colaborador a um ponto de embarque inexistente: title, local, details, lat, lng',
            HttpStatus.BAD_REQUEST,
          );
        }

        pin = await this.pinService.create({
          title,
          local,
          details,
          lat,
          lng,
        });
        await this.employeeOnPinService.delete(
          employee.id,
          employee.pins[0].id,
        );
        await this.employeeOnPinService.associateEmployeeByService(
          pin.id,
          employee,
        );
      }
    }

    const address = JSON.stringify(data?.address);

    const employeeDataUpdated = { ...data, address };

    const updatedEmployee = await this.employeeRepository.update(
      Object.assign(employee, {
        ...employee,
        address: employeeDataUpdated?.address,
        admission: employeeDataUpdated?.admission,
        costCenter: employeeDataUpdated?.costCenter,
        name: employeeDataUpdated?.name,
        registration: employeeDataUpdated?.registration,
        role: employeeDataUpdated?.role,
        shift: employeeDataUpdated?.shift,
      }),
    );

    return this.mapperOne(updatedEmployee);
  }

  async listAllEmployeesPins(ids: string[]): Promise<Employee[]> {
    return await this.employeeRepository.findByIds(ids);
  }

  async parseExcelFile(file: any) {
    if (!file)
      throw new HttpException(
        'Arquivo não encontrado.',
        HttpStatus.BAD_REQUEST,
      );

    const workbook = XLSX.read(file.buffer);
    const sheetName = workbook.SheetNames;
    const type = 'LISTA DE COLABORADORES';

    if (!Object.values(sheetName).includes(type))
      throw new HttpException(
        `Planilha tem que conter a aba de ${type}`,
        HttpStatus.BAD_REQUEST,
      );

    const sheet = workbook.Sheets[type];

    const headers = [
      'Matricula',
      'Nome Colaborador',
      'Admissão',
      'Cargo',
      'Turno',
      'Centro de Custo',
      'Endereço',
      'Numero',
      'Complemento',
      'Bairro',
      'CEP',
      'Cidade',
      'UF',
      'PONTO DE COLETA',
      'Referencia',
    ];

    if (
      headers.join('') !==
      [
        sheet.A1.v,
        sheet.B1.v,
        sheet.C1.v,
        sheet.D1.v,
        sheet.E1.v,
        sheet.F1.v,
        sheet.G1.v,
        sheet.H1.v,
        sheet.I1.v,
        sheet.J1.v,
        sheet.K1.v,
        sheet.L1.v,
        sheet.M1.v,
        sheet.N1.v,
        sheet.O1.v,
      ].join('')
    )
      throw new HttpException(
        ` Planilha tem que conter as colunas ${headers.join(
          ', ',
        )} respectivamente}`,
        HttpStatus.BAD_REQUEST,
      );

    const data: any = XLSX.utils.sheet_to_json(sheet);
    const employees: abc[] = [];

    const pinDenso = await this.pinService.listByLocal('Denso LTDA ');

    let line = 0;
    const messagesErrors = [];

    for (const row of data) {
      const address = {
        cep: row['CEP'],
        neighborhood: row['Bairro'],
        number: row['Numero']? row['Numero'] : '',
        street: row['Endereço'],
        city: 'MANAUS',
        state: 'AM',
        complement: row['Complemento']? row['Complemento'] : '',
      };

      const employee: CreateEmployeeFileDTO = {
        name: row['Nome Colaborador'],
        registration: row['Matricula'].toString(),
        role: row['Cargo'] ? row['Cargo'] : '',
        shift: row['Turno'],
        costCenter: (row['Centro de Custo']) ? row['Centro de Custo'] : '',
        address: address,
        admission: new Date(),
        pin: { ...pinDenso, typeCreation: ETypeCreationPin.IS_EXISTENT },
      };

      line++;
      employees.push({ line, employee });
    }
    let totalCreated = 0;
    let alreadyExisted = 0;
    const totalToCreate = employees.length;
    let aa;
    let result = [];
    for await (const item of employees) {
      const error = false;
      const employeeSchema = plainToClass(CreateEmployeeFileDTO, item.employee);
      const lineE = item.line;

      const errorsTest = await validateAsync(employeeSchema);
      console.log(errorsTest)
      const [teste] = errorsTest;
      const cont = 0;
if(errorsTest.length>0){
      messagesErrors.push({
        line: lineE,
        // field: errorsTest,
        meesage: teste,
      });
      const testew = messagesErrors.map((i) => {
        return i.meesage;
      });

      aa = testew.map((i) => 
      [
        
        {
          field: i?.property,
          message: i?.constraints,
        },
      ]
      );

       result = aa}

      if (!errorsTest.length) {
        const existsRegistration =
          await this.employeeRepository.findByRegistration(
            item.employee.registration,
          );

        if (!existsRegistration) {
          await this.employeeRepository.create(
            new Employee(
              {
                address: JSON.stringify(item.employee.address),
                admission: item.employee.admission,
                costCenter: item.employee.costCenter,
                name: item.employee.name,
                registration: item.employee.registration,
                password: bcrypt.hashSync(item.employee.registration, 10),
                role: item.employee.role,
                shift: item.employee.shift,
              },
              pinDenso,
            ),
          );
          totalCreated++;
        } else alreadyExisted++;
      }
    }

    const errors: any = {
      newEmployeesCreated: totalCreated,
      employeesAlreadyExistent: alreadyExisted,
      quantityEmployeesOnSheet: totalToCreate,
      errors: result,
    };

    
    return errors;
  }

  async exportsEmployeeFile(page: Page, filters?: FiltersEmployeeDTO) {
    const headers = [
      'MATRICULA',
      'NOME',
      'BAIRRO',
      'ENDEREÇO',
      'NUMERO',
      'COMPLEMENTO',
      'CEP',
      'C/C',
      'SETOR',
      'TURNO',
      'ADMISSAO',
    ];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './employee.xlsx';
    const workSheetName = 'Colaboradores';

    // const employees = await this.listAll(page, filters);
    const employees = await this.employeeRepository.findAll(page, filters);

    if (employees.total === 0) {
      throw new HttpException(
        'Não existem colaboradores para serem exportados!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (employees.total === 0) {
      throw new HttpException(
        'Não existem colaboradores para serem exportados!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const exportedEmployeeToXLSX = async (
      employees,
      headers,
      workSheetName,
      filePath,
    ) => {
      const data = employees.map((employee) => {
        const address = JSON.parse(employee.address);
        return [
          employee.registration,
          employee.name,
          address.neighborhood,
          address.street,
          address.number,
          address.complement,
          address.cep,
          employee.costCenter,
          employee.role,
          employee.shift,
          employee.admission,
        ];
      });

      const employeeInformationHeader = [
        [`COLABORADORES EXPORTADOS EM: ${today}`],
      ];

      const employeeInformationSubHeader = [
        [`TOTAL DE COLABORADORES EXPORTADOS: ${data.length}`],
      ];

      const employeeInformationFooter = [
        ['*************'],
        ['******************************************'],
        ['************************'],
        ['*************************************'],
        ['**********'],
        ['******************************************'],
        ['**********'],
        ['*******'],
        ['**************************'],
        ['*********************'],
        ['**********'],
      ];

      const workBook = XLSX.utils.book_new();
      const workSheetData = [
        '',
        employeeInformationHeader,
        '',
        employeeInformationSubHeader,
        '',
        employeeInformationFooter,
        '',
        headers,
        ...data,
        '',
      ];

      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = [
        { wch: 15 },
        { wch: 30 },
        { wch: 20 },
        { wch: 30 },
        { wch: 9 },
        { wch: 30 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
      ];

      workSheet['!merges'] = [{ s: { c: 0, r: 1 }, e: { c: 1, r: 1 } }];

      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);

      const exportedKanbans = fs.createReadStream(pathFile);

      return new StreamableFile(exportedKanbans);
    };

    return exportedEmployeeToXLSX(
      employees.items,
      headers,
      workSheetName,
      filePath,
    );
  }

  private mapperMany(employees: Employee[]): MappedEmployeeDTO[] {
    return employees.map((employee) => {
      return {
        id: employee.id,
        name: employee.name,
        address: JSON.parse(employee.address),
        admission: employee.admission,
        costCenter: employee.costCenter,
        registration: employee.registration,
        role: employee.role,
        shift: employee.shift,
        createdAt: employee.createdAt,
        pins: employee.pins?.map((employeesOnPin) => {
          return {
            id: employeesOnPin.pin.id,
            title: employeesOnPin.pin.title,
            local: employeesOnPin.pin.local,
            details: employeesOnPin.pin.details,
            lat: employeesOnPin.pin.lat,
            lng: employeesOnPin.pin.lng,
            type: employeesOnPin.type as ETypePin,
            createdAt: employeesOnPin.pin.createdAt,
          };
        }),
      };
    });
  }

  private mapperOne(employee: Employee): MappedEmployeeDTO {
    return {
      id: employee.id,
      name: employee.name,
      address: JSON.parse(employee.address),
      admission: employee.admission,
      costCenter: employee.costCenter,
      registration: employee.registration,
      role: employee.role,
      shift: employee.shift,
      createdAt: employee.createdAt,
      pins: employee.pins.map((employeesOnPin) => {
        return {
          id: employeesOnPin.pin.id,
          title: employeesOnPin.pin.title,
          local: employeesOnPin.pin.local,
          details: employeesOnPin.pin.details,
          lat: employeesOnPin.pin.lat,
          lng: employeesOnPin.pin.lng,
          type: employeesOnPin.type as ETypePin,
        };
      }),
    };
  }
}
