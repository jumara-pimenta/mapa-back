import { Page, PageResponse } from 'src/configs/database/page.model';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { DateFilterDTO } from 'src/dtos/routeHistory/dateFilter.dto';
import {
  GetRouteHistories,
  ListRouteHistories,
  GetRouteHistoriesByDate,
  GetRouteHistoriesByQuantity,
} from 'src/utils/examples.swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';
import { FiltersRouteHistoryDTO } from 'src/dtos/routeHistory/filtersRouteHistory.dto';
import { MappedRouteHistoryDTO } from 'src/dtos/routeHistory/mappedRouteHistory.dto';
import { EmployeeHistoryDTO } from 'src/dtos/routeHistory/employeesHistory.dto';

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

  @Get('/historic/date')
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
  async getHistoricByDate(@Query() dates: DateFilterDTO): Promise<any> {
    return await this.RouteHistoryService.getHistoricByDate(
      dates.dateInit,
      dates.dateFinal,
    );
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
}
