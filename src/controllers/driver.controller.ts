import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FiltersDriverDTO } from '../dtos/driver/filtersDriver.dto';
import { MappedDriverDTO } from '../dtos/driver/mappedDriver.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Driver } from '../entities/driver.entity';
import { DriverService } from '../services/driver.service';
import { CreateDriverDTO } from '../dtos/driver/createDriver.dto';
import { UpdateDriverDTO } from '../dtos/driver/updateDriver.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDriver,
  DeleteDriver,
  firstAccessDriverExample,
  GetAllDriver,
  GetDriver,
  resetDriverPasswordExample,
  UpdateDriver,
  UploadFileDrivers,
} from 'src/utils/examples.swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { xlsxFileFilter } from 'src/middlewares/image.middleware';
import { FirstAccessDriverDTO } from 'src/dtos/driver/firstAccess.dto';
import { resetDriverPasswordDTO } from 'src/dtos/driver/resetPassword.dto';

@Controller('/api/drivers')
@ApiTags('Drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @Roles('create-driver')
  @ApiCreatedResponse({
    description: 'Creates a new Driver.',
    schema: {
      type: 'object',
      example: CreateDriver,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateDriverDTO): Promise<Driver> {
    return await this.driverService.create(payload);
  }

  @Delete('/:id')
  @Roles('delete-driver')
  @ApiCreatedResponse({
    description: 'Delete a Driver.',
    schema: {
      type: 'object',
      example: DeleteDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.delete(id);
  }

  @Put('/:id')
  @Roles('edit-driver')
  @ApiCreatedResponse({
    description: 'Update a Driver.',
    schema: {
      type: 'object',
      example: UpdateDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDriverDTO,
  ): Promise<Driver> {
    return await this.driverService.update(id, data);
  }

  @Get()
  @Roles('list-driver')
  @ApiCreatedResponse({
    description: 'Get all Drivers.',
    schema: {
      type: 'object',
      example: GetAllDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersDriverDTO,
  ): Promise<PageResponse<MappedDriverDTO>> {
    return await this.driverService.listAll(page, filters);
  }

  @Get('/:id')
  @Roles('list-driver')
  @ApiCreatedResponse({
    description: 'Get a Driver by id.',
    schema: {
      type: 'object',
      example: GetDriver,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.listById(id);
  }

  @Get('/exports/file')
  @ApiCreatedResponse({
    description: 'Export a Driver File to XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportDriverFile(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filters: FiltersDriverDTO,
  ): Promise<StreamableFile> {
    const fileName = 'Sonar Rotas - Motoristas Exportados.xlsx';

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return await this.driverService.exportDriverFile(page, filters);
  }

  @Post('/upload')
  @Roles('import-drivers')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description:
      'Rota para fazer o upload de um arquivo excel com os dados dos motoristas',
    schema: {
      type: 'object',
      example: UploadFileDrivers,
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: xlsxFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: any,
  ) {
    return this.driverService.parseExcelFile(file);
  }

  @Get('/exports/empt/file')
  @Roles('list-driver')
  @ApiCreatedResponse({
    description: 'Lista Planilha Modelo Motorista XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportDriverEmptFile(
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const fileName = 'Sonar Rotas - Lista Planilha Modelo Motorista.xlsx';

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return await this.driverService.exportDriverEmptFile();
  }
  
  @Post('/firstAccess')
  @Roles('driver-first-access')
  @ApiCreatedResponse({
    description: 'Primeiro acesso de motorista.',
    schema: {
      type: 'object',
      example: firstAccessDriverExample,
    },
  })
  @HttpCode(HttpStatus.OK)
  async firstAccessDriver(@Body() data: FirstAccessDriverDTO): Promise<Driver>{
    return await this.driverService.firstAccess(data)
  }

  @Post('/resetPassword')
  @Roles('driver-reset-password')
  @ApiCreatedResponse({
    description: 'Reseta a senha do motorista.',
    schema: {
      type: 'object',
      example: resetDriverPasswordExample,
    },
  })
  @HttpCode(HttpStatus.OK)
  async resetDriverPassword(@Body() data: resetDriverPasswordDTO): Promise<Driver>{
    return await this.driverService.resetDriverPassword(data.cpf)
  }
}
