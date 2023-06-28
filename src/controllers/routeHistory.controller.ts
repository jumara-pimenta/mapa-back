import { Page, PageResponse } from '../configs/database/page.model';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { DateFilterDTO } from '../dtos/routeHistory/dateFilter.dto';
import {
  GetRouteHistories,
  ListRouteHistories,
  GetRouteHistoriesByDate,
  GetRouteHistoriesByQuantity,
} from '../utils/examples.swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';
import { FiltersRouteHistoryDTO } from '../dtos/routeHistory/filtersRouteHistory.dto';
import { MappedRouteHistoryDTO } from '../dtos/routeHistory/mappedRouteHistory.dto';
import {
  DateShift,
  EmployeeHistoryDTO,
} from '../dtos/routeHistory/employeesHistory.dto';

@Controller('/api/routes/histories')
@ApiTags('RouteHistories')
export class RouteHistoryController {
  constructor(private readonly RouteHistoryService: RouteHistoryService) {}

  @Get('/getByid/:id')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Route History by id.',
    schema: {
      type: 'object',
      example: GetRouteHistories,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<RouteHistory> {
    return await this.RouteHistoryService.listById(id);
  }

  @Get('/historic/quantity')
  @Roles('list-historic')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get the historic.',
    schema: {
      type: 'object',
      example: GetRouteHistoriesByQuantity,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getHistoric(): Promise<any> {
    return await this.RouteHistoryService.getHistoric();
  }

  @Get('/period/date')
  @Roles('list-historic')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get the historic of paths between 2 dates.',
    schema: {
      type: 'object',
      example: GetRouteHistoriesByDate,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getHistoricByDate(@Query() type: DateFilterDTO): Promise<any> {
    return await this.RouteHistoryService.getHistoricByDate(type.period);
  }

  @Get('/all')
  @Roles('list-historic')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'List all route histories.',
    schema: {
      type: 'object',
      example: ListRouteHistories,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersRouteHistoryDTO,
  ): Promise<PageResponse<MappedRouteHistoryDTO>> {
    return await this.RouteHistoryService.listAll(page, filters);
  }

  @Get('/pathId/id')
  @Roles('list-historic')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get the path history of an employee.',
    schema: {
      type: 'object',
      example: ListRouteHistories,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getEmployess(@Query() data: EmployeeHistoryDTO): Promise<any> {
    return await this.RouteHistoryService.listAllEmployess(data.id);
  }

  @Get('/shifts/byDate')
  @Roles('list-historic')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get the shifts of an employee by date.',
    schema: {
      type: 'object',
      example: ListRouteHistories,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getShiftsByDate(@Query() query: DateShift): Promise<any> {
    return await this.RouteHistoryService.getShiftsByDate(query.data);
  }

  @Get('/shifts/byDate/route')
  @Roles('list-historic')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get the shifts of an employee by date.',
    schema: {
      type: 'object',
      example: ListRouteHistories,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getRoutesByDateAndShift(@Query() query: DateShift): Promise<any> {
    return await this.RouteHistoryService.getRoutesByDateAndShift(
      query.data,
      query.shift,
    );
  }
}
