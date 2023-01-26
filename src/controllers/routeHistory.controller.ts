import { Page, PageResponse } from 'src/configs/database/page.model';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  GetRouteHistories,
  ListRouteHistories,
} from 'src/utils/examples.swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';
import { FiltersRouteHistoryDTO } from 'src/dtos/routeHistory/filtersRouteHistory.dto';
import { MappedRouteHistoryDTO } from 'src/dtos/routeHistory/mappedRouteHistory.dto';

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

  @Get('/all')
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
}
