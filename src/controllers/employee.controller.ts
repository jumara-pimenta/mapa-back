import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FiltersEmployeeDTO } from '../dtos/employee/filtersEmployee.dto';
import { MappedEmployeeDTO } from '../dtos/employee/mappedEmployee.dto';
import { Page, PageResponse } from '../configs/database/page.model';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDTO } from '../dtos/employee/createEmployee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/updateEmployee.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateEmployee,
  DeleteEmployee,
  GetAllEmployee,
  GetEmployee,
  UpdateEmployee,
} from '../utils/examples.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../decorators/roles.decorator';
import { xlsxFileFilter } from 'src/middlewares/image.middleware';

@Controller('/api/employees')
@ApiTags('Employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Post('/upload')
  @Roles('import-employees')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Rota para fazer o upload de um arquivo excel com os dados dos funcionários',
    schema: {
      type: 'object',
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
    return this.employeeService.parseExcelFile(file);
  }

  @Post()
  @Roles('create-employee')
  @ApiCreatedResponse({
    description: 'Creates a new Employee.',
    schema: {
      type: 'object',
      example: CreateEmployee,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateEmployeeDTO): Promise<Employee> {
    return await this.employeeService.create(payload);
  }

  @Delete('/:id')
  @Roles('delete-employee')
  @ApiCreatedResponse({
    description: 'Delete a Employees.',
    schema: {
      type: 'object',
      example: DeleteEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.delete(id);
  }

  @Put('/:id')
  @Roles('edit-employee')
  @ApiCreatedResponse({
    description: 'Update a Employee.',
    schema: {
      type: 'object',
      example: UpdateEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeeDTO,
  ): Promise<Employee> {
    return await this.employeeService.update(id, data);
  }

  @Get()
  @Roles('list-employee')
  @ApiCreatedResponse({
    description: 'Get all Employees.',
    schema: {
      type: 'object',
      example: GetAllEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<PageResponse<MappedEmployeeDTO>> {
    return await this.employeeService.listAll(page, filters);
  }

  @Get('/:id')
  @Roles('list-employee')
  @ApiCreatedResponse({
    description: 'Get a Employee by id.',
    schema: {
      type: 'object',
      example: GetEmployee,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.listById(id);
  }

  @Get('download/file')
  @Roles('export-employees')
  @ApiCreatedResponse({
    description: 'Colaboradores Exportados XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportsEmployeeFile(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Colaboradores Exportados.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.employeeService.exportsEmployeeFile(page, filters);
  }

  @Get('download/fileModel')
  @Roles('export-employees')
  @ApiCreatedResponse({
    description: 'Colaboradores Exportados XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportsEmployeeFileModel(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Colaboradores Exportados.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.employeeService.exportsEmployeeFileModel();
  }

  @Get('download/fileAddress')
  @Roles('export-employees')
  @ApiCreatedResponse({
    description: 'Colaboradores Exportados XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportsEmployeeFileAddress(
    @Response({ passthrough: true }) res,
    @Query() page: Page,
    @Query() filters: FiltersEmployeeDTO,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Colaboradores Exportados.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.employeeService.exportsEmployeeFileAddress();
  }

  @Get('/download/empt/file')
  @Roles('export-employees')
  @ApiCreatedResponse({
    description: 'Lista Planilha Modelo Colaboradores  XLSX.',
  })
  @HttpCode(HttpStatus.OK)
  async exportsEmployeeEmptFile(
    @Response({ passthrough: true }) res,
  ): Promise<any> {
    const fileName = 'Sonar Rotas - Lista Planilha Modelo Colaboradores.xlsx';
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return await this.employeeService.exportsEmployeeEmptFile();
  }
}
