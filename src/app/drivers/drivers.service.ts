import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import {
  AppMessageError,
  PrismaCodeError,
  PrismaMessageError,
} from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDriver } from '../dtos/driver/createDriver.dto';
import { Driver } from '../dtos/driver/driver.dto';
import { UpdateDriver } from '../dtos/driver/updateDriver.dto';

const dateColunsExistInDrivers = ['validation', 'createdAt'];

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

  async search(column: string, value: string): Promise<Driver[]> {
    if (dateColunsExistInDrivers.includes(column)) {
      const drivers = await this.prismaService.driver.findMany({
        where: {
          [column]: {
            gte: startOfDay(parseISO(value)),
            lte: endOfDay(parseISO(value)),
          },
        },
      });

      if (drivers.length === 0) {
        throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
      }

      return drivers;
    }

    const drivers = await this.prismaService.driver.findMany({
      where: {
        [column]: value,
      },
    });

    if (drivers.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return drivers;
  }
}
