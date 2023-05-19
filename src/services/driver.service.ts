import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import IDriverRepository from '../repositories/driver/driver.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersDriverDTO } from '../dtos/driver/filtersDriver.dto';
import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
import { CreateDriverDTO } from '../dtos/driver/createDriver.dto';
import { UpdateDriverDTO } from '../dtos/driver/updateDriver.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDriverFileDTO } from 'src/dtos/driver/createDriverFile.dto';
import { convertToDate } from 'src/utils/date.service';
import { verifyDateFilter } from 'src/utils/Date';
import { FirstAccessDriverDTO } from 'src/dtos/driver/firstAccess.dto';

const validateAsync = (schema: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    validate(schema, { validationError: { target: false } })
      .then((response) => resolve(response.map((i) => i)))
      .catch((error: any) => reject(error));
  });
};

interface driverDTO {
  line: number;
  driver: CreateDriverFileDTO;
}

@Injectable()
export class DriverService {
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
  ) {}

  async create(payload: CreateDriverDTO): Promise<Driver> {
    const cpfAlredyExist = await this.driverRepository.findByCpf(payload.cpf);
    const cnhAlredyExist = await this.driverRepository.findByCnh(payload.cnh);

    function isValidCPF(cpf) {
      if (typeof cpf !== 'string') return false;
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
      cpf = cpf.split('').map((el) => +el);
      const rest = (count) =>
        ((cpf
          .slice(0, count - 12)
          .reduce((soma, el, index) => soma + el * (count - index), 0) *
          10) %
          11) %
        10;
      return rest(10) === cpf[9] && rest(11) === cpf[10];
    }

    if (
      payload.cpf.length !== 11 ||
      (!Array.from(payload.cpf).filter((e) => e !== payload.cpf[0]).length &&
        isValidCPF)
    ) {
      throw new HttpException(
        `CPF INVALIDO: ${payload.cpf}`,
        HttpStatus.CONFLICT,
      );
    }
    if (cpfAlredyExist) {
      throw new HttpException(
        `CPF ja cadastrado: ${payload.cpf}`,
        HttpStatus.CONFLICT,
      );
    }
    if (cnhAlredyExist) {
      throw new HttpException(
        `CNH ja cadastrado: ${payload.cnh}`,
        HttpStatus.CONFLICT,
      );
    } else {
      const password = bcrypt.hashSync(payload.cpf, 10);
      return await this.driverRepository.create(
        new Driver({ ...payload, password }),
      );
    }
  }

  async delete(id: string): Promise<Driver> {
    const driver = await this.listById(id);

    return await this.driverRepository.delete(driver.id);
  }

  async listById(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);

    if (!driver)
      throw new HttpException(
        `Não foi encontrado um motorista com essa identificação: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return driver;
  }

  async listAll(
    page: Page,
    filters?: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
    verifyDateFilter(filters?.validation);
    const drivers = await this.driverRepository.findAll(page, filters);

    if (drivers.total === 0) {
      throw new HttpException(
        'Não existe motorista(s) para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(drivers.items);

    return {
      total: drivers.total,
      items,
    };
  }

  async update(id: string, data: UpdateDriverDTO): Promise<Driver> {
    const driver = await this.listById(id);

    if (data.cpf) {
      const cpfAlredyExist = await this.driverRepository.findByCpf(data.cpf);

      if (cpfAlredyExist && cpfAlredyExist.cpf !== driver.cpf) {
        throw new HttpException(
          `CPF ja cadastrado: ${data.cpf}`,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.cnh) {
      const cnhAlredyExist = await this.driverRepository.findByCnh(data.cnh);

      if (cnhAlredyExist && cnhAlredyExist.cnh !== driver.cnh) {
        throw new HttpException(
          `CNH ja cadastrado: ${data.cnh}`,
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.driverRepository.update(
      Object.assign(driver, { ...driver, ...data }),
    );
  }

  async getByCpf(cpf: string): Promise<Driver> {
    const driver = await this.driverRepository.findByCpf(cpf);

    if (!driver)
      throw new HttpException(
        `Não foi encontrado um motorista com o cpf: ${cpf}`,
        HttpStatus.NOT_FOUND,
      );

    return driver;
  }

  private toDTO(drivers: Driver[]): MappedDriverDTO[] {
    return drivers.map((driver) => {
      return {
        id: driver.id,
        category: driver.category,
        cnh: driver.cnh,
        cpf: driver.cpf,
        name: driver.name,
        validation: driver.validation,
        createdAt: driver.createdAt,
      };
    });
  }

  async parseExcelFile(file: any) {
    const workbook = XLSX.read(file.buffer);
    const sheetName = workbook.SheetNames;
    const type = 'Motoristas';
    if (!Object.values(sheetName).includes(type))
      throw new HttpException(
        `Planilha tem que conter a aba de ${type}`,
        HttpStatus.BAD_REQUEST,
      );
    const sheet = workbook.Sheets[type];
    const headers = ['Nome', 'CPF', 'CNH', 'Validade', 'Categoria'];
    if (
      headers.join('') !==
      [sheet.A1.v, sheet.B1.v, sheet.C1.v, sheet.D1.v, sheet.E1.v].join('')
    )
      throw new HttpException(
        'Planilha tem que conter as colunas Nome, CPF, CNH, Validade, Categoria',
        HttpStatus.BAD_REQUEST,
      );

    const drivers: driverDTO[] = [];

    let line = 0;
    const messagesErrors = [];

    const data: any = XLSX.utils.sheet_to_json(sheet);
    for (const row of data) {
      const driver: CreateDriverFileDTO = {
        name: row['Nome'] ? row['Nome'].toString() : '',
        cpf: row['CPF'] ? row['CPF'].toString().replace(/[.-]/g, '') : '',
        cnh: row['CNH'] ? row['CNH'].toString() : '',
        validation: row['Validade']
          ? convertToDate(row['Validade'].toString())
          : new Date(),
        category: row['Categoria'] ? row['Categoria'].toString() : '',
      };
      line++;
      drivers.push({ line, driver });
    }

    let totalCreated = 0;
    let alreadyExisted = 0;
    const totalToCreate = drivers.length;
    let aa;
    let result = [];

    for await (const item of drivers) {
      const driver = plainToClass(CreateDriverFileDTO, item.driver);
      const lineE = item.line;
      const errorsTest = await validateAsync(driver);
      const [teste] = errorsTest;
      if (errorsTest.length > 0) {
        messagesErrors.push({
          line: lineE,
          // field: errorsTest,
          message: teste,
        });
        const testew = messagesErrors.map((i) => {
          return { property: i.message, line: i.line };
        });

        aa = testew.map((i) => [
          {
            field: i?.property.property,
            message: i?.property.constraints,
            linha: i.line + 1,
          },
        ]);

        result = aa;
      }

      if (!errorsTest.length) {
        const existsCpf = await this.driverRepository.findByCpf(
          item.driver.cpf,
        );

        const existsCnh = await this.driverRepository.findByCnh(
          item.driver.cnh,
        );

        if (!existsCpf && !existsCnh) {
          await this.driverRepository.create(
            new Driver({
              name: item.driver.name,
              cpf: item.driver.cpf,
              cnh: item.driver.cnh,
              validation: item.driver.validation,
              category: item.driver.category,
              password: await bcrypt.hash('Denso', 10),
            }),
          );
          totalCreated++;
        } else alreadyExisted++;
      }
    }

    const errors: any = {
      newDriversCreated: totalCreated,
      driversAlreadyExistent: alreadyExisted,
      quantityDriversOnSheet: totalToCreate,
      errors: result,
    };

    return errors;
  }

  async exportDriverFile(page: Page, filters?: FiltersDriverDTO) {
    const headers = ['Nome', 'CPF', 'CNH', 'Validade', 'Categoria'];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './driver.xlsx';
    const workSheetName = 'Motoristas';

    const drivers = await this.driverRepository.findAllExport();
    const exportedDriverToXLSX = async (
      drivers,
      headers,
      workSheetName,
      filePath,
    ) => {
      const data = drivers.map((driver) => {
        return [
          driver.name,
          driver.cpf,
          driver.cnh,
          driver.validation,
          driver.category,
        ];
      });
      if (!data.length)
        throw new HttpException(
          'Não foram encontrados motoristas para serem exportados',
          HttpStatus.NOT_FOUND,
        );

      const workBook = XLSX.utils.book_new();
      // eslint-disable-next-line no-sparse-arrays
      const workSheetData = [headers, ...data];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 9 },
      ];

      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);

      const exportedKanbans = fs.createReadStream(pathFile);

      return new StreamableFile(exportedKanbans);
    };

    return exportedDriverToXLSX(
      drivers.items,
      headers,
      workSheetName,
      filePath,
    );
  }

  async exportDriverEmptFile() {
    const headers = ['Nome', 'CPF', 'CNH', 'Validade', 'Categoria'];

    const filePath = './driver.xlsx';
    const workSheetName = 'Motoristas';

    const exportedDriverToXLSX = async (
      headers: string[],
      workSheetName: string,
      filePath: string,
    ) => {
      const workBook = XLSX.utils.book_new();
      const workSheetData = [headers];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 9 },
      ];

      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);
      const exportedKanbans = fs.createReadStream(pathFile);
      return new StreamableFile(exportedKanbans);
    };

    return exportedDriverToXLSX(headers, workSheetName, filePath);
  }

  async firstAccess(data: FirstAccessDriverDTO): Promise<Driver>{

    const driversAlreadyExists = await this.driverRepository.findByCpf(data.cpf)

    if(!driversAlreadyExists){
      throw new HttpException('Motorista não encontrado', HttpStatus.NOT_FOUND)
    }

    if(driversAlreadyExists.firstAccess == false){
      throw new HttpException('Senha já foi definida', HttpStatus.BAD_REQUEST)
    }
    
    const checkIfPasswordMatches = data.password === data.confirmPassword

    if(!checkIfPasswordMatches){
      throw new HttpException('Senhas não correspondem', HttpStatus.BAD_REQUEST)
    }

    return await this.driverRepository.updateDriverPassword(data.cpf, data.password)
  }
}
