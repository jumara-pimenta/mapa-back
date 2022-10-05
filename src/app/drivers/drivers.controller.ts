import { UpdateDriver } from './../dtos/driver/updateDriver.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CreateDriver } from '../dtos/driver/createDriver.dto';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriver: CreateDriver) {
    return await this.driversService.create(createDriver);
  }

  @Get()
  async findAll() {
    return await this.driversService.findAll();
  }

  @Get('search')
  async search(@Query('column') column: string, @Query('value') value: string) {
    return await this.driversService.search(column, value);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDriverDto: UpdateDriver,
  ) {
    return await this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.driversService.remove(id);
  }
}
