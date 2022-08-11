import { Controller, Post, Body, Get } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  async create(@Body() createCarDto: Prisma.CarCreateInput) {
    return await this.carsService.create(createCarDto);
  }

  @Get()
  async findAll() {
    return await this.carsService.findAll();
  }
}
