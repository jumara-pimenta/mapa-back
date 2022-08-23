import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car, Prisma } from '@prisma/client';
import {
  AppMessageError,
  PrismaCodeError,
  PrismaMessageError,
} from 'src/constants/exceptions';
import { PrismaService } from 'src/database/prisma.service';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

const dateColunsExistInCars = [
  'lastSurvey',
  'expiration',
  'lastMaintenance',
  'createdAt',
];

@Injectable()
export class CarsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.CarCreateInput): Promise<Car> {
    try {
      const car = await this.prismaService.car.create({
        data,
      });
      return car;
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

  async findAll(): Promise<Car[]> {
    const cars = await this.prismaService.car.findMany();

    if (cars.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return cars;
  }

  async search(column: string, value: string): Promise<Car[]> {
    if (dateColunsExistInCars.includes(column)) {
      const cars = await this.prismaService.car.findMany({
        where: {
          [column]: {
            gte: startOfDay(parseISO(value)),
            lte: endOfDay(parseISO(value)),
          },
        },
      });

      if (cars.length === 0) {
        throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
      }

      return cars;
    }

    const cars = await this.prismaService.car.findMany({
      where: {
        [column]: value,
      },
    });

    if (cars.length === 0) {
      throw new NotFoundException(AppMessageError.NO_RESULTS_QUERY);
    }

    return cars;
  }
}
