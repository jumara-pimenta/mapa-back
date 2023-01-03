import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RouteHistory } from '../entities/routeHistory.entity';
import { RouteHistoryService } from '../services/routeHistory.service';

@Controller('/api/routes/histories')
@ApiTags('RouteHistories')

export class RouteHistoryController {
  constructor(private readonly RouteHistoryService: RouteHistoryService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<RouteHistory> {
    return await this.RouteHistoryService.listById(id);
  }
}
