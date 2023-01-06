import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdatePathDTO } from '../dtos/path/updatePath.dto';
import { EStatusPath } from '../utils/ETypes';
import { MappedPathDTO } from '../dtos/path/mappedPath.dto';
import { Path } from '../entities/path.entity';
import { PathService } from '../services/path.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/routes')
@ApiTags('Paths')

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

  @Get('/paths/employee/:employeeId')
  @HttpCode(HttpStatus.OK)
  async getManyByEmployee(
    @Param('employeeId') employeeId: string,
  ): Promise<MappedPathDTO[]> {    
    return await this.pathService.listManyByEmployee(employeeId);
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

  @Get('/paths/employees/:employeeId/status/:status')
  @HttpCode(HttpStatus.OK)
  async getByEmployeeAndStatus(
    @Param('employeeId') employeeId: string,
    @Param('status') status: EStatusPath,
  ): Promise<MappedPathDTO> {
    return await this.pathService.listByEmployeeAndStatus(employeeId, status);
  }

  @Get('/paths/pins/:id')
  @HttpCode(HttpStatus.OK)
  async pathPins(@Param('id') id: string): Promise<any> {
    return await this.pathService.listEmployeesByPathAndPin(id);
  }

  @Post('/paths/start/:id')
  @HttpCode(HttpStatus.OK)
  async startPath(@Param('id') id: string): Promise<unknown> {
    return await this.pathService.startPath(id);
  }

  @Post('/paths/finish/:id')
  @HttpCode(HttpStatus.OK)
  async finishPath(@Param('id') id: string): Promise<unknown> {
    return await this.pathService.finishPath(id);
  }


}
