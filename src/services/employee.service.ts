import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
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

import { EmployeeAddressDTO } from 'src/dtos/employee/employeeAddress.dto';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

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
            'O do ponto de embarque precisa ser enviado para associar ao ponto de embarque existente!',
            HttpStatus.BAD_REQUEST,
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
        await this.employeeOnPinService.associateEmployeeByService(
          pin.id,
          employee,
        );
      }
    }

    const address = JSON.stringify(data?.address);

    const employeeDataUpdated = { ...data, address };

    const updatedEmployee = await this.employeeRepository.update(
      Object.assign(employee, { ...employee, ...employeeDataUpdated }),
    );

    return this.mapperOne(updatedEmployee);
  }

  async listAllEmployeesPins(ids: string[]): Promise<Employee[]> {
    return await this.employeeRepository.findByIds(ids);
  }

  async parseExcelFile(file: any) {
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
      'MATRICULA',
      'NOME',
      'BAIRRO',
      'ENDEREÇO',
      'NUMERO',
      'CEP',
      'C/C',
      'SETOR',
      'TURNO',
      'ADMISSAO',
    ];
    if (
      headers.join('') !==
      [
        sheet.A1.v,
        sheet.B1.v,
        sheet.C1.v,
        sheet.D1.v,
        sheet.E1.v,
        sheet.G1.v,
        sheet.H1.v,
        sheet.I1.v,
        sheet.J1.v,
        sheet.L1.v,
      ].join('')
    )
      throw new HttpException(
        'Planilha tem que conter as colunas MATRICULA, NOME e SETOR.',
        HttpStatus.BAD_REQUEST,
      );
    const data: any = XLSX.utils.sheet_to_json(sheet);
    const employees: CreateEmployeeFileDTO[] = [];
    for (const row of data) {
      const address = {
        cep: row['CEP'].toString(),
        neighborhood: row['BAIRRO'].toString(),
        number: row['NUMERO'].toString(),
        street: row['ENDEREÇO'].toString(),
        city: 'MANAUS',
        state: 'AM',
      };

      const employee: CreateEmployeeFileDTO = {
        name: row['NOME'].toString(),
        registration: row['MATRICULA'].toString(),
        role: row['SETOR'].toString(),
        shift: row['TURNO'].toString(),
        costCenter: row['C/C'].toString(),
        address: JSON.stringify(address),
        admission: new Date(),
      };
      employees.push(employee);
    }
    let totalCreated = 0;
    let alreadyExisted = 0;
    let dataError = 0;
    const totalToCreate = employees.length;

    for await (const item of employees) {
      const employee = plainToClass(CreateEmployeeFileDTO, item);
      let error = false;
      validate(employee, { validationError: { target: false } }).then(
        async (errors) => {
          if (errors.length > 0) {
            dataError++;
            error = true;
          }
        },
      );

      if (!error) {
        const existsRegistration =
          await this.employeeRepository.findByRegistration(item.registration);

        if (!existsRegistration) {
          const password = bcrypt.hashSync(item.registration, 10);
          await this.employeeRepository.create(
            new Employee({ ...item, password }),
          );
          totalCreated++;
        } else alreadyExisted++;
      }
    }

    return {
      message: [
        `Cadastrado com sucesso: ${totalCreated}`,
        `Já existia um cadastro com a mesma matrícula: ${alreadyExisted}`,
        `Colaboradores com dados inválidos: ${dataError}`,
        `Quantidade total de colaboradores na planilha: ${totalToCreate}`,
      ],
    };
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

    const employees = await this.listAll(page, filters);

    const exportedEmployeeToXLSX = async (
      employees,
      headers,
      workSheetName,
      filePath,
    ) => {
      const data = employees.map((employee) => {
        return [
          employee.registration,
          employee.name,
          employee.address.neighborhood,
          employee.address.street,
          employee.address.number,
          employee.address.complement,
          employee.address.cep,
          employee.costCenter,
          employee.role,
          employee.shift,
          employee.admission,
        ];
      });

      let employeeInformationHeader = [
        [`COLABORADORES EXPORTADOS: ${today}`],
        [`TOTAL DE COLABORADORES EXPORTADOS: ${data.length}`],
      ];

      let employeeInformationFooter = [
        ['**********************************************'],
        ['***********************************************'],
        ['************************'],
        ['*************************************'],
        ['**********'],
        ['************************************************************'],
        ['**********'],
        ['*******'],
        ['***************************************************************'],
        ['*********************'],
        ['************'],
      ];

      const workBook = XLSX.utils.book_new();
      const workSheetData = [
        ,
        employeeInformationHeader,
        ,
        employeeInformationFooter,
        ,
        headers,
        ...data,
        ,
        employeeInformationFooter,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
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
