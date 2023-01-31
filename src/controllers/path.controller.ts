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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateFinishPath,
  CreateStartPath,
  GetPathByDriver,
  GetPathByDriverAndStatus,
  GetPathByEmployee,
  GetPathByEmployeeAndStatus,
  GetPathById,
  GetPathByPins,
  GetPathByRoutes,
  UpdatePathById,
} from 'src/utils/examples.swagger';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('/api/routes')
@ApiTags('Paths')
export class PathController {
  constructor(private readonly pathService: PathService) {}

  @Get('/paths/:id')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Paths by id.',
    schema: {
      type: 'object',
      example: GetPathById,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Path> {
    return await this.pathService.listByIdMobile(id);
  }

  @Get('/:routeId/paths')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Paths by Route.',
    schema: {
      type: 'object',
      example: GetPathByRoutes,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(
    @Param('routeId') routeId: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByRoute(routeId);
  }

  @Get('/paths/drivers/:driverId')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Paths by Driver.',
    schema: {
      type: 'object',
      example: GetPathByDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getManyByDriver(
    @Param('driverId') driverId: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByDriver(driverId);
  }

  @Get('/paths/employee/:employeeId')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Paths by Employee.',
    schema: {
      type: 'object',
      example: GetPathByEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getManyByEmployee(
    @Param('employeeId') employeeId: string,
  ): Promise<MappedPathDTO[]> {
    return await this.pathService.listManyByEmployee(employeeId);
  }

  @Get('/paths/drivers/:driverId/status/:status')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get a Paths by Driver and Status.',
    schema: {
      type: 'object',
      example: GetPathByDriverAndStatus,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getOneByStatus(
    @Param('driverId') driverId: string,
    @Param('status') status: EStatusPath,
  ): Promise<any> {
    return await this.pathService.listOneByDriverAndStatus(driverId, status);
  }

  @Put('/paths/:id')
  @Roles('edit-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Update a Paths by Id.',
    schema: {
      type: 'object',
      example: UpdatePathById,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePathDTO,
  ): Promise<Path> {
    return await this.pathService.update(id, payload);
  }

  @Get('/paths/employees/:employeeId/status/:status')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'List a Paths by Employee and Status.',
    schema: {
      type: 'object',
      example: GetPathByEmployeeAndStatus,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getByEmployeeAndStatus(
    @Param('employeeId') employeeId: string,
    @Param('status') status: EStatusPath,
  ): Promise<MappedPathDTO> {
    return await this.pathService.listByEmployeeAndStatus(employeeId, status);
  }

  @Get('/paths/pins/:id')
  @Roles('list-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'List a Paths by Pins.',
    schema: {
      type: 'object',
      example: GetPathByPins,
    },
  })
  @HttpCode(HttpStatus.OK)
  async pathPins(@Param('id') id: string): Promise<any> {
    return await this.pathService.listEmployeesByPathAndPin(id);
  }

  @Post('/paths/start/:id')
  @Roles('edit-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Start Path',
    schema: {
      type: 'object',
      example: CreateStartPath,
    },
  })
  @HttpCode(HttpStatus.OK)
  async startPath(@Param('id') id: string): Promise<unknown> {
    return await this.pathService.startPath(id);
  }

  @Post('/paths/finish/:id')
  @Roles('edit-path')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Finish Path',
    schema: {
      type: 'object',
      example: CreateFinishPath,
    },
  })
  @HttpCode(HttpStatus.OK)
  async finishPath(@Param('id') id: string): Promise<Path> {
    return await this.pathService.finishPath(id);
  }
}
