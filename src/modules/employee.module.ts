import { Module } from "@nestjs/common";
import { EmployeeController } from "../controllers/employee.controller";
import { EmployeeRepository } from "../repositories/employee/employee.repository";
import { EmployeeService } from "../services/employee.service";

@Module({
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: "IEmployeeRepository",
      useClass: EmployeeRepository
    }
  ],
  exports: [EmployeeService]
})

export class EmployeeModule {}
