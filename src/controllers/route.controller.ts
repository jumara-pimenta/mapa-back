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
  Response,
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
} from '../utils/examples.swagger';
import { Roles } from '../decorators/roles.decorator';
import { FilterRouteExport } from '../dtos/route/filterRouteExport';
import { RouteReplacementDriverDTO } from '../dtos/route/routeReplacementDriverDTO.dto';
import { RouteMobile } from '../utils/Utils';
import { CreateRouteExtraEmployeeDTO } from '../dtos/route/createRouteExtraEmployee.dto';
import { CreateSuggestionExtra } from '../dtos/route/createSuggestionExtra.dto';
import { CreateSugestedRouteDTO } from '../dtos/route/createSugestedRoute.dto';
import { SuggenstionResultDTO } from '../dtos/route/SuggenstionResult.dto';

@Controller('/api/routes')
@ApiTags('Routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}
  @Post()
  @Roles('create-route')
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
  @Roles('delete-route')
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
  @Roles('edit-route')
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
  @Roles('list-route')
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

  @Get('mobile/:driverId/short')
  @Roles('list-route')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List all routes.',
    schema: {
      type: 'object',
      // example: ListRoutes,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAllMobile(
    @Query() page: Page,
    @Query() filters: FiltersRouteDTO,
    @Param('driverId') driverId?: string,
  ): Promise<RouteMobile[]> {
    return await this.routeService.listAllMobile(page, filters, driverId);
  }

  @Get('/:id')
  @Roles('list-route')
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
  @Roles('list-route')
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

  @Get('/download/file')
  @ApiCreatedResponse({
    description: 'Export a Route File to XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportRouteToFile(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filter: FilterRouteExport,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Rotas Exportadas.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.routeService.exportsRouteFile(page, filter.type);
  }

  @Get('/export/route/:id')
  @ApiCreatedResponse({
    description: 'Export a Paths pf a route File to XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportPathToFile(
    @Response({ passthrough: true }) res,
    @Param('id') id: string,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Trajetos Exportados.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.routeService.exportsPathToFile(id);
  }

  @Post('/replace/drivers')
  @HttpCode(HttpStatus.OK)
  async replaceDrivers(
    @Body() payload: RouteReplacementDriverDTO,
  ): Promise<any> {
    return await this.routeService.routeReplacementDriver(payload);
  }

  @Post('/create/suggestion')
  @HttpCode(HttpStatus.OK)
  async createSuggestion(
    @Body() payload: CreateRouteExtraEmployeeDTO,
  ): Promise<any> {
    return await this.routeService.createExtras(payload);
  }

  @Post('/create/extra')
  @HttpCode(HttpStatus.OK)
  async createExtras(
    @Body() payload: CreateSugestedRouteDTO,
  ): Promise<SuggenstionResultDTO[]> {
    return await this.routeService.createSugestionRoute(payload);
  }
}
