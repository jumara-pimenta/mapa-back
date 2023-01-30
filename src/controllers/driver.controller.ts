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
  Response,
  StreamableFile,
} from '@nestjs/common';
import { FiltersDriverDTO } from '../dtos/driver/filtersDriver.dto';
import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
import { CreateDriverDTO } from '../dtos/driver/createDriver.dto';
import { UpdateDriverDTO } from '../dtos/driver/updateDriver.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateDriver,
  DeleteDriver,
  GetAllDriver,
  GetDriver,
  UpdateDriver,
} from '../utils/examples.swagger';
import { Roles } from '../decorators/roles.decorator';

@Controller('/api/drivers')
@ApiTags('Drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @Roles('create-driver')
  @ApiCreatedResponse({
    description: 'Creates a new Driver.',
    schema: {
      type: 'object',
      example: CreateDriver,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateDriverDTO): Promise<Driver> {
    return await this.driverService.create(payload);
  }

  @Delete('/:id')
  @Roles('delete-driver')
  @ApiCreatedResponse({
    description: 'Delete a Driver.',
    schema: {
      type: 'object',
      example: DeleteDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.delete(id);
  }

  @Put('/:id')
  @Roles('edit-driver')
  @ApiCreatedResponse({
    description: 'Update a Driver.',
    schema: {
      type: 'object',
      example: UpdateDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDriverDTO,
  ): Promise<Driver> {
    return await this.driverService.update(id, data);
  }

  @Get()
  @Roles('list-driver')
  @ApiCreatedResponse({
    description: 'Get all Drivers.',
    schema: {
      type: 'object',
      example: GetAllDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
    return await this.driverService.listAll(page, filters);
  }

  @Get('/:id')
  @Roles('list-driver')
  @ApiCreatedResponse({
    description: 'Get a Driver by id.',
    schema: {
      type: 'object',
      example: GetDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.listById(id);
  }

  @Get('/exports/file')
  @ApiCreatedResponse({
    description: 'Export a Driver File to XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportDriverFile(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filters: FiltersDriverDTO,
  ): Promise<StreamableFile> {
    const fileName = 'Sonar Rotas - Motoristas Exportados.xlsx';

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return await this.driverService.exportDriverFile(page, filters);
  }
}
