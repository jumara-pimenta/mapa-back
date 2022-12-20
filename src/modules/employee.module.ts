import { forwardRef, Module } from '@nestjs/common';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeRepository } from '../repositories/employee/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { EmployeesOnPinModule } from './employeesOnPin.module';
import { PinModule } from './pin.module';

@Module({
  controllers: [EmployeeController],
  imports: [
    forwardRef(() => EmployeesOnPinModule),
    forwardRef(() => PinModule),
  ],
  providers: [
    EmployeeService,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
