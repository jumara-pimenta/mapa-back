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
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateRoute,
  DeleteRoute,
  GetRoutesByDriver,
  ListRoutes,
  UpdateRoute,
} from 'src/utils/examples.swagger';

@Controller('/api/routes')
@ApiTags('Routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Post()
  @ApiCreatedResponse({
    description: 'Creates a new Route.',
    schema: {
      type: 'object',
      example: CreateRoute,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateRouteDTO): Promise<Route> {
    return await this.routeService.create(payload);
  }

  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft delete a route.',
    schema: {
      type: 'object',
      example: DeleteRoute,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Route> {
    return await this.routeService.softDelete(id);
  }

  @Put('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a route.',
    schema: {
      type: 'object',
      example: UpdateRoute,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRouteDTO,
  ): Promise<Route> {
    return await this.routeService.update(id, data);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List all routes.',
    schema: {
      type: 'object',
      example: ListRoutes,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    return await this.routeService.listAll(page, filters);
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List a route by id.',
    schema: {
      type: 'object',
      example: UpdateRoute,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<MappedRouteDTO> {
    return await this.routeService.listById(id);
  }

  @Get('/paths/driver/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List a route by driver.',
    schema: {
      type: 'object',
      example: GetRoutesByDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getPathsByDriverId(
    @Param('id') id: string,
    @Query() page: Page,
    @Query() filters: FiltersRouteDTO,
  ): Promise<PageResponse<MappedRouteDTO>> {
    return await this.routeService.listByDriverId(id, page, filters);
  }
}
