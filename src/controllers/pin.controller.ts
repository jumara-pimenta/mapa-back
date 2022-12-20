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

@Controller('/api/pins')
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post()
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
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    return await this.pinService.listAll(page, filters);
  }
}
