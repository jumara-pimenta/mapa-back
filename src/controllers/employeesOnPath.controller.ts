import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query } from "@nestjs/common";
import { UpdateEmployeesStatusOnPathDTO } from "src/dtos/employeesOnPath/updateEmployeesStatusOnPath.dto";
import { MappedEmployeesOnPathDTO } from "../dtos/employeesOnPath/mappedEmployeesOnPath.dto";
import { EmployeesOnPathService } from "../services/employeesOnPath.service";

@Controller("/api/routes/paths/employees")
export class EmployeesOnPathController {
  constructor(
    private readonly employeeOnPathService: EmployeesOnPathService
  ) { }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getByRoute(@Param("id") id: string): Promise<MappedEmployeesOnPathDTO> {
    return await this.employeeOnPathService.listById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getManyByRoute(@Query("route") route: string): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.listManyByRoute(route);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateEmployeeConfirmation(@Body() payload:UpdateEmployeesStatusOnPathDTO): Promise<MappedEmployeesOnPathDTO[]> {
    return await this.employeeOnPathService.updateStatus(payload);
  }
 
}
