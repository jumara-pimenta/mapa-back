import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetRouteHistories,
  GetRouteHistoriesByDate,
  GetRouteHistoriesByQuantity,
} from '../utils/examples.swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';
import { Roles } from '../decorators/roles.decorator';
import { DateFilterDTO } from '../dtos/routeHistory/dateFilter.dto';

@Controller('/api/routes/histories')
@ApiTags('RouteHistories')
export class RouteHistoryController {
  constructor(private readonly RouteHistoryService: RouteHistoryService) {}

  @Get('/:id')
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
}
