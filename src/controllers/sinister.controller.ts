import { Page, PageResponse } from '../configs/database/page.model';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { CreateSinisterDTO } from '../dtos/sinister/createSinister.dto';
import { UpdateSinisterDTO } from '../dtos/sinister/updateSinister.dto';
import { Sinister } from '../entities/sinister.entity';
import { SinisterService } from '../services/sinister.service';
import {
  CreateSinister,
  GetAllSinister,
  GetSinisterById,
  UpdateSinister,
} from '../utils/examples.swagger';
import { FiltersSinisterDTO } from '../dtos/sinister/filtersSinister.dto';
import { MappedSinisterDTO } from '../dtos/sinister/mappedSinister.dto';

@Controller('/api/sinister')
@ApiTags('Sinister')
export class SinisterController {
  constructor(private readonly sinisterService: SinisterService) {}

  @Post()
  @Roles('create-sinister')
  @ApiCreatedResponse({
    description: 'Creates a new Sinister.',
    schema: {
      type: 'object',
      example: CreateSinister,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payload: CreateSinisterDTO,
    @Headers('authorization') token: string,
  ): Promise<Sinister> {
    return await this.sinisterService.create(payload, token);
  }

  @Put('/:id')
  @Roles('edit-sinister')
  @ApiCreatedResponse({
    description: 'Update a Sinister.',
    schema: {
      type: 'object',
      example: UpdateSinister,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSinisterDTO,
  ): Promise<Sinister> {
    return await this.sinisterService.update(id, data);
  }

  @Get('/:id')
  @Roles('list-sinister')
  @ApiCreatedResponse({
    description: 'Get a Sinister by id.',
    schema: {
      type: 'object',
      example: GetSinisterById,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Sinister> {
    return await this.sinisterService.listById(id);
  }

  @Get()
  @Roles('list-sinister')
  @ApiCreatedResponse({
    description: 'Get all Sinisters.',
    schema: {
      type: 'object',
      example: GetAllSinister,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersSinisterDTO,
  ): Promise<PageResponse<MappedSinisterDTO>> {
    return await this.sinisterService.listAll(page, filters);
  }
}
