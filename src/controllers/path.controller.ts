import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { MappedPathDTO } from '../dtos/path/mappedPath.dto';
import { Path } from '../entities/path.entity';
import { PathService } from '../services/path.service';
import { EStatusPath } from '../utils/ETypes';

@Controller('/api/routes')
export class PathController {
  constructor(private readonly pathService: PathService) {}

  @Get('/paths/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Path> {
    return await this.pathService.listById(id);
  }

  @Get('/:routeId/paths')
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(
    @Param('routeId') routeId: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByRoute(routeId);
  }

  @Get('/paths/drivers/:driverId')
  @HttpCode(HttpStatus.OK)
  async getManyByDriver(
    @Param('driverId') driverId: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByDriver(driverId);
  }

  @Get('/paths/drivers/:driverId/status/:status')
  @HttpCode(HttpStatus.OK)
  async getOneByStatus(
    @Param('driverId') driverId: string,
    @Param('status') status: EStatusPath,
  ): Promise<Path> {
    return await this.pathService.listOneByDriverAndStatus(driverId, status);
  }

  @Put('/paths/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePathDTO,
  ): Promise<Path> {
    return await this.pathService.update(id, payload);
  }
}
