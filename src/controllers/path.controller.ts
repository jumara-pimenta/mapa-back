import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { MappedPathDTO } from "../dtos/path/mappedPath.dto";
import { Path } from "../entities/path.entity";
import { PathService } from "../services/path.service";

@Controller("/api/routes/paths")
export class PathController {
  constructor(
    private readonly pathService: PathService
  ) { }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Path> {
    return await this.pathService.listById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(@Query('route') route: string): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByRoute(route);
  }
}
