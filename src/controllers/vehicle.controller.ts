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
import {
  CreateVehicle,
  DeleteVehicle,
  GetAllVehicle,
  GetVehicle,
  UpdateVehicle,
} from 'src/utils/examples.swagger';

@Controller('/api/vehicles')
@ApiTags('Vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Vehicle.',
    schema: {
      type: 'object',
      example: CreateVehicle,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateVehicleDTO): Promise<Vehicle> {
    return await this.vehicleService.create(payload);
  }

  @Delete('/:id')
  @ApiCreatedResponse({
    description: 'Delete a Vehicle.',
    schema: {
      type: 'object',
      example: DeleteVehicle,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Vehicle> {
    return await this.vehicleService.delete(id);
  }

  @Put('/:id')
  @ApiCreatedResponse({
    description: 'Update a Vehicle.',
    schema: {
      type: 'object',
      example: UpdateVehicle,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return await this.vehicleService.update(id, data);
  }

  @Get()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'List all Vehicle.',
    schema: {
      type: 'object',
      example: GetAllVehicle,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersVehicleDTO,
  ): Promise<PageResponse<MappedVehicleDTO>> {
    return await this.vehicleService.listAll(page, filters);
  }

  @Get('/:id')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Vehicle by id.',
    schema: {
      type: 'object',
      example: GetVehicle,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Vehicle> {
    return await this.vehicleService.listById(id);
  }
}
