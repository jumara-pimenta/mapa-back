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
import {
  CreatePin,
  DeletePin,
  GetAllPin,
  GetPin,
  UpdatePin,
} from '../utils/examples.swagger';
import { Roles } from '../decorators/roles.decorator';

@Controller('/api/pins')
@ApiTags('Pins')
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post()
  @Roles('create-pin')
  @ApiCreatedResponse({
    description: 'Creates a new Pin.',
    schema: {
      type: 'object',
      example: CreatePin,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreatePinDTO): Promise<Pin> {
    return await this.pinService.create(payload);
  }

  @Delete('/:id')
  @Roles('delete-pin')
  @ApiCreatedResponse({
    description: 'Delete a Pin.',
    schema: {
      type: 'object',
      example: DeletePin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Pin> {
    return await this.pinService.delete(id);
  }

  @Put('/:id')
  @Roles('edit-pin')
  @ApiCreatedResponse({
    description: 'Update a Pin.',
    schema: {
      type: 'object',
      example: UpdatePin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePinDTO,
  ): Promise<Pin> {
    return await this.pinService.update(id, data);
  }

  @Get('/:id')
  @Roles('list-pin')
  @ApiCreatedResponse({
    description: 'Get a Pin by id.',
    schema: {
      type: 'object',
      example: GetPin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Pin> {
    return await this.pinService.listById(id);
  }

  @Get()
  @Roles('list-pin')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List all Pins.',
    schema: {
      type: 'object',
      example: GetAllPin,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersPinDTO,
  ): Promise<PageResponse<Pin>> {
    return await this.pinService.listAll(page, filters);
  }
}
