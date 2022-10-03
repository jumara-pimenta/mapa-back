import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCar } from '../dtos/car/createCar.dto';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  async create(@Body() createCar: CreateCar) {
    return await this.carsService.create(createCar);
  }

  @Get()
  async findAll() {
    return await this.carsService.findAll();
  }

  @Get('search')
  async search(@Query('column') column: string, @Query('value') value: string) {
    return await this.carsService.search(column, value);
  }
}
