import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import * as path from 'path';

import { bindNodeCallback } from 'rxjs';
import {
  AppMessageError,
  PrismaCodeError,
  PrismaMessageError,
} from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { generateQueryByFiltersForDrivers } from 'src/database/queries/Queries';
import { blob } from 'stream/consumers';
import { CreateDriver } from '../dtos/driver/createDriver.dto';
import { Driver } from '../dtos/driver/driver.dto';
import { DriverSearch } from '../dtos/driver/searchDriver.dto';
import { UpdateDriver } from '../dtos/driver/updateDriver.dto';
import xlsx from 'node-xlsx';
import { Readable, Writable } from 'stream';
import * as fs from 'fs';
import { generateKeyWithFilename, pipelineAsync, verifyReportDirectory } from '../utils/Utils';

const dateColunsExistInDrivers = ['validation', 'createdAt', 'name','cnh'];

@Injectable()
export class DriversService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDriver: CreateDriver): Promise<Driver> {
    try {
      const driver = await this.prismaService.driver.create({
        data: createDriver,
      });
      return driver;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaCodeError.UNIQUE_CONSTRAINT
      ) {
        throw new BadGatewayException(
          PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Driver[]> {
    const drivers = await this.prismaService.driver.findMany();

    if (drivers.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return drivers;
  }

  async update(id: string, data: UpdateDriver): Promise<Driver> {
    try {
      const checkExistDriver = await this.prismaService.driver.findFirst({
        where: { id },
      });

      if (!checkExistDriver) {
        throw new NotFoundException('Motorista não encontrado');
      }

      const driver = await this.prismaService.driver.update({
        where: { id },
        data: data,
      });

      return driver;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaCodeError.UNIQUE_CONSTRAINT
      ) {
        throw new BadGatewayException(
          PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
        );
      }
      throw error;
    }
  }

  async search(value: DriverSearch): Promise<Driver[]> {
    const condition = generateQueryByFiltersForDrivers(value);
    console.log(condition)
    const drivers = condition ? await this.prismaService.driver.findMany({
      where : condition
    }) : await this.prismaService.driver.findMany()

    if (drivers.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return drivers;
  }

  async remove(id: string) {
    const driver = await this.prismaService.driver.findUnique({
      where: { id },
    });
    if (!driver) {
      throw new NotFoundException('Motorista não encontrado');
    }

    await this.prismaService.driver.delete({ where: { id } });

    return;
  }


  async export(){

    await verifyReportDirectory()

    const fileName = await generateKeyWithFilename('Sonar Rotas - Motoristas Exportados.xlsx')

    const pathReport = path.join(process.cwd(), 'tmp', 'reports', fileName)
    const drivers = await this.prismaService.driver.findMany({
      select:{
        name :true,
        cpf :true,
        cnh:true,
        category:true,
        validation:true,
        createdAt:true
      }
    })

    if(!drivers?.length) throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);

    const keys: string[]  = Object.keys(drivers[0]);

    let columHearders: string[];
    columHearders = keys;


    const data : DriverSearch[]=[]
    drivers.forEach(drivers =>{
        data.push({
          name: drivers.name,
          cpf: drivers.cpf,
          cnh: drivers.cnh,
          category: drivers.category,
          validation: drivers.validation,
          createdAt:drivers.createdAt })
    })

    let driverDataForSheet: Array<Array<any>> = [
      ['name', 'cpf', 'cnh', 'category','validation', 'createdAt']
    ]

    data.forEach(data =>{
      driverDataForSheet.push([data.name,data.cpf,data.cnh,data.category,data.validation,data.createdAt])
    })
    // const csvContent : any =
    // "sep=,\n" +
    // columHearders.join(separator) +
    // '\n' +
    // data.map(row => {
    //     return keys.map(k => {
    //         let cell = row[k] === null || row[k] === undefined ? '' : row[k];

    //         cell = cell instanceof Date 
    //             ? cell.toLocaleString()
    //             : cell.toString().replace(/"/g, '""');

    //         if (cell.search(/("|,|\n)/g) >= 0) {
    //             cell = `"${cell}"`;
    //         }
    //         return cell;
    //     }).join(separator);
    // }).join('\n');

    const sheetOptions = {'!cols': [{wch: 6}, {wch: 7}, {wch: 10}, {wch: 20}]};

    const buffer = xlsx.build([
      { 
        name: 'Motoristas exportados', 
        data: driverDataForSheet,
        options : sheetOptions
       
      },
    ]);


    const file = new Readable()

    file.push(buffer)
    file.push(null)


    await pipelineAsync(
      file,
    new Writable({
      async write(this, chunk: Buffer, encoding: string, callback: Function) {
        try {
          fs.writeFile(`${pathReport}`, chunk, error => {
            if (error) {
              throw new NotFoundException(AppMessageError.UNKNOWN_ERROR);
            }
          });

          callback(null);
        } catch (e) {
          callback(e);
        }
      }
    }));

    const exportedDrivers = fs.createReadStream(pathReport);

    return new StreamableFile(exportedDrivers);
  }

  
  
}
