import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { RouteHistory } from "../entities/RouteHistory.entity";
import { RouteHistoryService } from "../services/RouteHistory.service";

@Controller("/api/routes/histories")
export class RouteHistoryController {
  constructor(
    private readonly RouteHistoryService: RouteHistoryService
  ) { }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<RouteHistory> {
    return await this.RouteHistoryService.listById(id);
  }
}
