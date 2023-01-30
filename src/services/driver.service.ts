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
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

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
        `Não foi encontrado um driver com o id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return driver;
  }

  async listAll(
    page: Page,
    filters?: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
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
    const type = 'LISTA DE MOTORISTAS';
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
    const data: any = XLSX.utils.sheet_to_json(sheet);
    const drivers: CreateDriverDTO[] = [];
    for (const row of data) {
      const driver: CreateDriverDTO = {
        name: row['NOME'].toString(),
        cpf: row['CPF'].toString(),
        cnh: row['CNH'].toString(),
        validation: row['VALIDADE'].toString(),
        category: row['CATEGORIA'].toString(),
      };
      drivers.push(driver);
    }
    const totalCreated = 0;
    const alreadyExisted = 0;
    let dataError = 0;
    const totalToCreate = drivers.length;

    for await (const item of drivers) {
      const driver = plainToClass(CreateDriverDTO, item);
      let error = false;
      validate(driver, { validationError: { target: false } }).then(
        async (errors) => {
          if (errors.length > 0) {
            dataError++;
            error = true;
          }
        },
      );
    }

    return {
      message: [
        `Cadastrado com sucesso: ${totalCreated}`,
        `Motoristas com dados inválidos: ${dataError}`,
        `Quantidade total de motoristas na planilha: ${totalToCreate}`,
      ],
    };
  }

  async exportDriverFile(page: Page, filters?: FiltersDriverDTO) {
    const headers = [
      'Nome                          ',
      'CPF',
      'CNH',
      'Validade',
      'Categoria',
    ];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './driver.xlsx';
    const workSheetName = 'Motorista';

    const drivers = await this.listAll(page, filters);

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

      const driverInformationHeader = [
        [`MOTORISTAS EXPORTADOS: ${today}`, '', '', '', '', ''],
        [`TOTAL DE MOTORISTAS EXPORTADOS: ${data.length}`],
      ];

      const driverInformationFooter = [
        ['**********************************************'],
        ['***************'],
        ['***************'],
        ['***************'],
        ['*****'],
      ];

      const workBook = XLSX.utils.book_new();
      // eslint-disable-next-line no-sparse-arrays
      const workSheetData = [
        ,
        driverInformationHeader,
        ,
        driverInformationFooter,
        ,
        headers,
        ...data,
        ,
        driverInformationFooter,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
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
}
