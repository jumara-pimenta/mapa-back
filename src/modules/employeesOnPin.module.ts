import { Module } from "@nestjs/common";
import { EmployeesOnPinController } from "../controllers/employeesOnPin.controller";
import { EmployeesOnPinRepository } from "../repositories/employeesOnPin/employeesOnPin.repository";
import { EmployeesOnPinService } from "../services/employeesOnPin.service";
import { EmployeeModule } from "./employee.module";
import { PinModule } from "./pin.module";

@Module({
  imports: [
    EmployeeModule,
    PinModule
  ],
  controllers: [EmployeesOnPinController],
  providers: [
    EmployeesOnPinService,
    {
      provide: "IEmployeesOnPinRepository",
      useClass: EmployeesOnPinRepository
    }
  ],
  exports: [EmployeesOnPinService]
})

export class EmployeesOnPinModule {}
