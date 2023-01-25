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
import { GetRouteHistories } from 'src/utils/examples.swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';

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
  })
  @HttpCode(HttpStatus.OK)
  async getHistoricByDate(@Query() dates: DateFilterDTO): Promise<any> {
    return await this.RouteHistoryService.getHistoricByDate(
      dates.dateInit,
      dates.dateFinal,
    );
  }
}
