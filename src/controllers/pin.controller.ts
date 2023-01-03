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
import { Pin } from '../entities/pin.entity';
import { PinService } from '../services/pin.service';
import { CreatePinDTO } from '../dtos/pin/createPin.dto';
import { UpdatePinDTO } from '../dtos/pin/updatePin.dto';
import { FiltersPinDTO } from '../dtos/pin/filtersPin.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api/pins')
@ApiTags('Pins')

export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Pin.',
    schema: {
      type: 'object',
      example: {
        id: '52c6a405-0d98-42e7-86e0-95cabee5812f',
        title: 'Título do local',
        local: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
        details: 'Detalhes do local',
        lat: '-60.0261',
        lng: '-3.10719',
        createdAt: new Date(),
        updatedAt: null
      }  
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreatePinDTO): Promise<Pin> {
    return await this.pinService.create(payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Pin> {
    return await this.pinService.delete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePinDTO,
  ): Promise<Pin> {
    return await this.pinService.update(id, data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Pin> {
    return await this.pinService.listById(id);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List all Pins.',
    schema: {
      type: 'object',
      example: 
        {
          total: 4,
          items: [
            {
              id: '4df5e44e-d856-4e95-a18f-a1f86bd83e3e',
              title: 'RUA LUZAKA',
              local: 'OPAPA',
              details: 'ali perto',
              lat: '-3.0632477',
              lng: '-1.0562907',
              createdAt: '2023-01-03T10:34:51.600Z'
            },
            {
              id: '52c6a405-0d98-42e7-86e0-95cabee5812f',
              title: 'Título do local',
              local: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
              details: 'Detalhes do local',
              lat: '-60.0261',
              lng: '-3.10719',
              createdAt: '2023-01-03T11:06:03.436Z'
            },
            {
              id: '8ce47810-4106-429c-9e5d-17e110f852fa',
              title: 'RUA LUZAKA12',
              local: 'OPAPA',
              details: ' ali perto',
              lat: '0.0000000',
              lng: '0.000000',
              createdAt: '2023-01-03T10:34:39.449Z'
            },
            {
              id: 'c30b1f44-be06-4209-abc3-e2359d5f0709',
              title: 'Título do local',
              local: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-200, Brasil',
              details: 'Detalhes do local',
              lat: '-3.10719',
              lng: '-60.0261',
              createdAt: '2023-01-03T10:06:02.096Z'
            }
          ]
        }
      }})
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    return await this.pinService.listAll(page, filters);
  }
}
