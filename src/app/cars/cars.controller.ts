import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { CreateCar } from '../dtos/car/createCar.dto';
import { UpdateCar } from '../dtos/car/updateCar.dto';
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

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCarDto: UpdateCar,
  ) {
    return await this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.carsService.remove(id);
  }
}
