import { forwardRef, Module } from '@nestjs/common';
import { GoogleApiServiceIntegration } from '../integrations/services/googleService/google.service.integration';
import { EmployeeController } from '../controllers/employee.controller';
import { EmployeeRepository } from '../repositories/employee/employee.repository';
import { EmployeeService } from '../services/employee.service';
import { EmployeesOnPinModule } from './employeesOnPin.module';
import { PinModule } from './pin.module';
import { PathModule } from './path.module';
import { EmployeesOnPathModule } from './employeesOnPath.module';

@Module({
  controllers: [EmployeeController],
  imports: [
    forwardRef(() => EmployeesOnPinModule),
    forwardRef(() => PinModule),
    forwardRef(() => PathModule),
    forwardRef(() => EmployeesOnPathModule),
    
  ],
  providers: [
    EmployeeService,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
    {
      provide: 'IGoogleApiServiceIntegration',
      useClass: GoogleApiServiceIntegration,
    },
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
