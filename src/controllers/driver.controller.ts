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
import { FiltersDriverDTO } from '../dtos/driver/filtersDriver.dto';
import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
import { CreateDriverDTO } from '../dtos/driver/createDriver.dto';
import { UpdateDriverDTO } from '../dtos/driver/updateDriver.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api/drivers')
@ApiTags('Drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Driver.',
    schema: {
      type: 'object',
      example: {
        id: "dc0e9792-f935-4411-a016-de4509d55054",
        name: "João da Silva",
        cpf: "96893908563",
        cnh: "123456789",
        // add year to date to avoid error
        validation: new Date(Date.now() + 31536000000),
        category: "AB",
        createdAt:  new Date(),
        updatedAt: null
      },      
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateDriverDTO): Promise<Driver> {
    return await this.driverService.create(payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.delete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDriverDTO,
  ): Promise<Driver> {
    return await this.driverService.update(id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
    return await this.driverService.listAll(page, filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.listById(id);
  }
}
