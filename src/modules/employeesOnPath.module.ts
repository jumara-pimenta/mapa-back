import { forwardRef, Module } from "@nestjs/common";
import { EmployeesOnPathController } from "src/controllers/employeesOnPath.controller";
import { EmployeesOnPathRepository } from "../repositories/employeesOnPath/employeesOnPath.repository";
import { EmployeesOnPathService } from "../services/employeesOnPath.service";
import { EmployeeModule } from "./employee.module";
import { PathModule } from "./path.module";

@Module({
  imports: [
    EmployeeModule,
    forwardRef(() => PathModule)
  ],
  controllers: [EmployeesOnPathController],
  providers: [
    EmployeesOnPathService,
    {
      provide: "IEmployeesOnPathRepository",
      useClass: EmployeesOnPathRepository
    }
  ],
  exports: [EmployeesOnPathService]
})

export class EmployeesOnPathModule {}
