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
import { FiltersRouteDTO } from '../dtos/route/filtersRoute.dto';
import { MappedRouteDTO } from '../dtos/route/mappedRoute.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Route } from '../entities/route.entity';
import { RouteService } from '../services/route.service';
import { CreateRouteDTO } from '../dtos/route/createRoute.dto';
import { UpdateRouteDTO } from '../dtos/route/updateRoute.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('/api/routes')
@ApiTags('Routes')

export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Route.',
    schema: {
      type: 'object',
      example: {
        id: "644a4b19-6133-4506-b4f7-216fb3ffd7e7",
        description: "Rota 1",
        distance: "EM PROCESSAMENTO",
        type: "CONVENCIONAL",
        status: "PENDENTE",
        driverId: "05e7ce8b-b3e2-4295-b584-8e2caae2d809",
        vehicleId: "41b4eb3d-e18a-4c8e-a668-49824b21579c",
        createdAt: "2023-01-02T12:21:09.946Z",
        updatedAt: null,
        deletedAt: null
      }   
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateRouteDTO): Promise<Route> {
    return await this.routeService.create(payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Route> {
    return await this.routeService.softDelete(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRouteDTO,
  ): Promise<Route> {
    return await this.routeService.update(id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    return await this.routeService.listAll(page, filters);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<MappedRouteDTO> {
    return await this.routeService.listById(id);
  }

  @Get('/paths/driver/:id')
  @HttpCode(HttpStatus.OK)
  async getPathsByDriverId(
    @Param('id') id: string,
    @Query() page: Page,
    @Query() filters: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    return await this.routeService.listByDriverId(id, page, filters);
  }

}
