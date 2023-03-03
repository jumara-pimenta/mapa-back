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
import { CreateVehicleFileDTO } from 'src/dtos/vehicle/createVehicleFile.dto';
import { convertToDate } from 'src/utils/date.service';
import { verifyDateFilter } from 'src/utils/Date';

const validateAsync = (schema: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    validate(schema, { validationError: { target: false } })
      .then((response) => resolve(response.map((i) => i)))
      .catch((error: any) => reject(error));
  });
};

interface vehicleDTO {
  line: number;
  vehicle: CreateVehicleFileDTO;
}

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
    verifyDateFilter(filters.lastMaintenance);
    verifyDateFilter(filters.lastSurvey);
    verifyDateFilter(filters.expiration);

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
    const type = 'Veículos';
    if (!Object.values(sheetName).includes(type))
      throw new HttpException(
        `Planilha tem que conter a aba de ${type}`,
        HttpStatus.BAD_REQUEST,
      );
    const sheet = workbook.Sheets[type];
    const headers = [
      'Placa',
      'Empresa',
      'Tipo',
      'Última vistoria',
      'Vencimento',
      'Capacidade',
      'Renavam',
      'Última manutenção',
      'Observação',
      'Acessibilidade',
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
      ].join('')
    )
      throw new HttpException(
        'Planilha tem que conter as colunas Placa, Empresa, Tipo, Última vistoria, Vencimento, Capacidade, Renavam, Última manutenção, Observação, Acessibilidade',
        HttpStatus.BAD_REQUEST,
      );

    const vehicles: vehicleDTO[] = [];

    let line = 0;
    const messagesErrors = [];

    const data: any = XLSX.utils.sheet_to_json(sheet);
    for (const row of data) {
      const vehicle: CreateVehicleFileDTO = {
        plate: row['Placa'] ? row['Placa'].toString() : '',
        company: row['Empresa'] ? row['Empresa'].toString() : '',
        type: row['Tipo'] ? row['Tipo'].toString() : '',
        lastSurvey: row['Última vistoria']
          ? convertToDate(row['Última vistoria'].toString())
          : new Date(),
        expiration: row['Vencimento']
          ? convertToDate(row['Vencimento'].toString())
          : new Date(),
        capacity: row['Capacidade'] ? row['Capacidade'] : '',
        renavam: row['Renavam'] ? row['Renavam'].toString() : '',
        lastMaintenance: row['Última manutenção']
          ? convertToDate(row['Última manutenção'].toString())
          : new Date(),
        note: row['Observação'] ? row['Observação'].toString() : '',
        isAccessibility: row['Acessibilidade']
          ? row['Acessibilidade'].toString() === 'SIM'
            ? true
            : false
          : null,
      };
      line++;
      vehicles.push({ line, vehicle });
    }
    let totalCreated = 0;
    let alreadyExisted = 0;
    const totalToCreate = vehicles.length;
    let aa;
    let result = [];

    for await (const item of vehicles) {
      const vehicle = plainToClass(CreateVehicleFileDTO, item.vehicle);
      const lineE = item.line;
      const errorsTest = await validateAsync(vehicle);
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
        const existsPlate = await this.vehicleRepository.findByPlate(
          item.vehicle.plate,
        );

        const existsRenavam = await this.vehicleRepository.findByRenavam(
          item.vehicle.renavam,
        );

        if (!existsPlate && !existsRenavam) {
          await this.vehicleRepository.create(
            new Vehicle({
              plate: item.vehicle.plate,
              company: item.vehicle.company,
              type: item.vehicle.type,
              lastSurvey: item.vehicle.lastSurvey,
              expiration: item.vehicle.expiration,
              capacity: item.vehicle.capacity,
              renavam: item.vehicle.renavam,
              lastMaintenance: item.vehicle.lastMaintenance,
              note: item.vehicle.note,
              isAccessibility: item.vehicle.isAccessibility,
            }),
          );
          totalCreated++;
        } else alreadyExisted++;
      }
    }

    const errors: any = {
      newVehiclesCreated: totalCreated,
      vehiclesAlreadyExistent: alreadyExisted,
      quantityVehiclesOnSheet: totalToCreate,
      errors: result,
    };

    return errors;
  }

  async exportVehicleFile(page: Page, filters?: FiltersVehicleDTO) {
    const headers = [
      'Placa',
      'Empresa',
      'Tipo',
      'Última vistoria',
      'Vencimento',
      'Capacidade',
      'Acessibilidade',
      'Última manutenção',
    ];
    const today = new Date().toLocaleDateString('pt-BR');

    const filePath = './vehicle.xlsx';
    const workSheetName = 'Veículos';

    const vehicles = await this.vehicleRepository.findAllExport();

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
          vehicle.isAccessibility === true ? 'SIM' : 'NÃO',
          vehicle.lastMaintenance,
        ];
      });

      if (!data.length)
        throw new HttpException(
          'Não foram encontrados veículos para serem exportados',
          HttpStatus.NOT_FOUND,
        );

      const vehicleInformationHeader = [
        [`VEÍCULOS EXPORTADOS: ${today}`, '', '', '', '', ''],
      ];

      const driverInformationSubHeader = [
        [`TOTAL DE VEÍCULOS EXPORTADOS: ${data.length}`],
      ];

      const vehicleInformationFooter = [
        ['**************'],
        ['*********************************'],
        ['**********************'],
        ['****************'],
        ['****************'],
        ['**************'],
        ['******************'],
        ['********************'],
      ];

      const workBook = XLSX.utils.book_new();
      // eslint-disable-next-line no-sparse-arrays
      const workSheetData = [
        ,
        vehicleInformationHeader,
        ,
        driverInformationSubHeader,
        ,
        vehicleInformationFooter,
        ,
        headers,
        ...data,
        ,
        vehicleInformationFooter,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = [
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 11 },
        { wch: 10 },
        { wch: 9 },
        { wch: 11 },
        { wch: 15 },
      ];

      workSheet['!merges'] = [{ s: { c: 0, r: 1 }, e: { c: 1, r: 1 } }];

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
