import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UpdatePathDTO } from 'src/dtos/path/updatePath.dto';
import { EStatusPath } from 'src/utils/ETypes';
import { MappedPathDTO } from '../dtos/path/mappedPath.dto';
import { Path } from '../entities/path.entity';
import { PathService } from '../services/path.service';

@Controller('/api/routes/paths')
export class PathController {
  constructor(private readonly pathService: PathService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Path> {
    return await this.pathService.listById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(
    @Query('route') route: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByRoute(route);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id') id: string,
    @Body() payload: UpdatePathDTO,
  ): Promise<Path> {
    return await this.pathService.update(id, payload);
  }

  @Get('/employees/:employeeId/status/:status')
  @HttpCode(HttpStatus.OK)
  async getByEmployeeAndStatus(
    @Param('employeeId') employeeId: string,
    @Param('status') status: EStatusPath,
  ): Promise<MappedPathDTO> {
    return await this.pathService.listByEmployeeAndStatus(employeeId, status);
  }
}
