import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import IVehicleRepository from '../repositories/vehicle/vehicle.repository.contract';
import { Page, PageResponse } from '../configs/database/page.model';
import { FiltersVehicleDTO } from '../dtos/vehicle/filtersVehicle.dto';
import { MappedVehicleDTO } from '../dtos/vehicle/mappedVehicle.dto';
import { CreateVehicleDTO } from '../dtos/vehicle/createVehicle.dto';
import { UpdateVehicleDTO } from '../dtos/vehicle/updateVehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject('IVehicleRepository')
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async create(payload: CreateVehicleDTO): Promise<Vehicle> {
    const plateExists = await this.vehicleRepository.findByPlate(payload.plate);
    const renavamExists = await this.vehicleRepository.findByRenavam(
      payload.renavam,
    );

    if (plateExists)
      throw new HttpException(
        'Placa cadastrada para outro veículo',
        HttpStatus.CONFLICT,
      );

    if (renavamExists)
      throw new HttpException(
        'Renavam cadastrado para outro veículo',
        HttpStatus.CONFLICT,
      );

    return await this.vehicleRepository.create(
      new Vehicle({
        ...payload,
        expiration: new Date(payload.expiration),
        lastMaintenance: new Date(payload.lastMaintenance),
        lastSurvey: new Date(payload.lastSurvey),
      }),
    );
  }

  async delete(id: string): Promise<Vehicle> {
    const vehicle = await this.listById(id);

    return await this.vehicleRepository.delete(vehicle.id);
  }

  async listById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle)
      throw new HttpException(
        'veículo não foi encontrado',
        HttpStatus.NOT_FOUND,
      );

    return vehicle;
  }

  async listAll(
    page: Page,
    filters?: FiltersVehicleDTO,
  ): Promise<PageResponse<MappedVehicleDTO>> {
    const vehicles = await this.vehicleRepository.findAll(page, filters);

    if (vehicles.total === 0) {
      throw new HttpException(
        'Não existe veículo para esta pesquisa!',
        HttpStatus.NOT_FOUND,
      );
    }

    const items = this.toDTO(vehicles.items);

    return {
      total: vehicles.total,
      items,
    };
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.listById(id);

    if (data.plate) {
      const plateExists = await this.vehicleRepository.findByPlate(data.plate);

      if (plateExists && plateExists.plate !== vehicle.plate) {
        throw new HttpException(
          'Placa cadastrada para outro veículo',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (data.renavam) {
      const renavamExists = await this.vehicleRepository.findByRenavam(
        data.renavam,
      );

      if (renavamExists && renavamExists.renavam !== vehicle.renavam) {
        if (renavamExists.id !== id) {
          throw new HttpException(
            'Renavam cadastrado para outro veículo',
            HttpStatus.CONFLICT,
          );
        }
      }
    }

    return await this.vehicleRepository.update(
      Object.assign(vehicle, { ...vehicle, ...data }),
    );
  }

  private toDTO(vehicles: Vehicle[]): MappedVehicleDTO[] {
    return vehicles.map((vehicle) => {
      return {
        id: vehicle.id,
        capacity: vehicle.capacity,
        company: vehicle.company,
        expiration: vehicle.expiration,
        isAccessibility: vehicle.isAccessibility,
        lastMaintenance: vehicle.lastMaintenance,
        lastSurvey: vehicle.lastSurvey,
        note: vehicle.note,
        plate: vehicle.plate,
        renavam: vehicle.renavam,
        type: vehicle.type,
        createdAt: vehicle.createdAt,
      };
    });
  }

  async parseExcelFile(file: any) {
    const workbook = XLSX.read(file.buffer);
    const sheetName = workbook.SheetNames;
    const type = 'LISTA DE VEÍCULOS';
    if (!Object.values(sheetName).includes(type))
      throw new HttpException(
        `Planilha tem que conter a aba de ${type}`,
        HttpStatus.BAD_REQUEST,
      );
    const sheet = workbook.Sheets[type];
    const headers = [
      'Placa',
      'Empresa',
      'Tipo do carro',
      'Última vistoria',
      'Vencimento',
      'Capacidade',
      'Acessibilidade',
      'Última manutenção',
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
      ].join('')
    )
      throw new HttpException(
        'Planilha tem que conter as colunas Placa, Empresa, Tipo do carro, Última vistoria, Vencimento, Capacidade, Acessibilidade, Última manutenção',
        HttpStatus.BAD_REQUEST,
      );
    const data: any = XLSX.utils.sheet_to_json(sheet);
    const vehicles: CreateVehicleDTO[] = [];
    for (const row of data) {
      const driver: CreateVehicleDTO = {
        plate: row['PLACA'].toString(),
        company: row['EMPRESA'].toString(),
        type: row['TIPO DO CARRO'].toString(),
        lastSurvey: row['ÚLTIMA VISTORIA'].toString(),
        expiration: row['VENCIMENTO'].toString(),
        capacity: row['CAPACIDADE'].toString(),
        isAccessibility: row['ACESSIBILIDADE'].toString(),
        lastMaintenance: row['ÚLTIMA MANUTENÇÃO'].toString(),
        renavam: row['RENAVAM'].toString(),
        note: row['OBSERVAÇÃO'].toString(),
      };
      vehicles.push(driver);
    }
    const totalCreated = 0;
    let dataError = 0;
    const totalToCreate = vehicles.length;

    for await (const item of vehicles) {
      const driver = plainToClass(CreateVehicleDTO, item);
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
        `Veículos com dados inválidos: ${dataError}`,
        `Quantidade total de veículos na planilha: ${totalToCreate}`,
      ],
    };
  }

  async exportVehicleFile(page: Page, filters?: FiltersVehicleDTO) {
    const headers = [
      'Placa',
      'Empresa',
      'Tipo do carro',
      'Última vistoria',
      'Vencimento',
      'Capacidade',
      'Acessibilidade',
      'Última manutenção',
    ];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './vehicle.xlsx';
    const workSheetName = 'Veículos';

    const vehicles = await this.listAll(page, filters);

    const exportedDriverToXLSX = async (
      vehicles,
      headers,
      workSheetName,
      filePath,
    ) => {
      const data = vehicles.map((vehicle) => {
        return [
          vehicle.plate,
          vehicle.company,
          vehicle.type,
          vehicle.lastSurvey,
          vehicle.expiration,
          vehicle.capacity,
          vehicle.lastMaintenance,
          vehicle.isAccessibility,
        ];
      });

      if (!data.length)
        throw new HttpException(
          'Não foram encontrados veículos para serem exportados',
          HttpStatus.NOT_FOUND,
        );

      const vehicleInformationHeader = [
        [`VEÍCULOS EXPORTADOS: ${today}`, '', '', '', '', ''],
        [`TOTAL DE VEÍCULOS EXPORTADOS: ${data.length}`],
      ];

      const vehicleInformationFooter = [
        ['***********'],
        ['*****************************'],
        ['***************'],
        ['***************'],
        ['***************'],
        ['****'],
        ['***************'],
        ['*****'],
      ];

      const workBook = XLSX.utils.book_new();
      // eslint-disable-next-line no-sparse-arrays
      const workSheetData = [
        ,
        vehicleInformationHeader,
        ,
        vehicleInformationFooter,
        ,
        headers,
        ...data,
        ,
        vehicleInformationFooter,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
      const pathFile = path.resolve(filePath);
      XLSX.writeFile(workBook, pathFile);

      const exportedKanbans = fs.createReadStream(pathFile);

      return new StreamableFile(exportedKanbans);
    };

    return exportedDriverToXLSX(
      vehicles.items,
      headers,
      workSheetName,
      filePath,
    );
  }
}
