import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FiltersVehicleDTO } from '../dtos/vehicle/filtersVehicle.dto';
import { MappedVehicleDTO } from '../dtos/vehicle/mappedVehicle.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Vehicle } from '../entities/vehicle.entity';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDTO } from '../dtos/vehicle/createVehicle.dto';
import { UpdateVehicleDTO } from '../dtos/vehicle/updateVehicle.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api/vehicles')
@ApiTags('Vehicles')

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Vehicle.',
    schema: {
      type: 'object',
      example: {
        id: "af036f4e-bfcf-4994-ab50-f167ee908f4e",
        plate: "PHP1234",
        company: "Expresso",
        type: "ÔNIBUS",
        lastSurvey: new Date(),
        expiration: new Date(),
        capacity: 28,
        renavam: "12345678901",
        lastMaintenance: new Date(),
        note: "Teste",
        isAccessibility: true,
        createdAt: new Date(),
        updatedAt: null
      },      
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateVehicleDTO): Promise<Vehicle> {
    return await this.vehicleService.create(payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Vehicle> {
    return await this.vehicleService.delete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return await this.vehicleService.update(id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersVehicleDTO,
  ): Promise<PageResponse<MappedVehicleDTO>> {
    return await this.vehicleService.listAll(page, filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Vehicle> {
    return await this.vehicleService.listById(id);
  }
}
