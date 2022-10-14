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
  StreamableFile,
  Response,
} from '@nestjs/common';
import { CreateDriver } from '../dtos/driver/createDriver.dto';
import { DriversService } from './drivers.service';
import { Driver } from '@prisma/client';
import { DriverSearch } from '../dtos/driver/searchDriver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  async create(@Body() createDriver: CreateDriver) {
    return await this.driversService.create(createDriver);
  }

  // @Get()
  // async findAll() {
  //   return await this.driversService.findAll();
  // }


  @Get()
  async listarCompraSearch(
    @Query() search: DriverSearch,
  ): Promise<Driver[]> {
    console.log(search)
    return await this.driversService.search(search)

  }
  
  @Get('/download/exportDrivers')
  async exportDrivers(@Response({passthrough : true}) res) : Promise<StreamableFile>{
    const fileName = 'Sonar Rotas - Motoristas Exportados.xlsx'
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.driversService.export()
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
