import { forwardRef, Module } from '@nestjs/common';
import { EmployeesOnPathController } from '../controllers/employeesOnPath.controller';
import { EmployeesOnPathRepository } from '../repositories/employeesOnPath/employeesOnPath.repository';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';
import { EmployeeModule } from './employee.module';
import { PathModule } from './path.module';
import { RouteModule } from './route.module';

@Module({
  imports: [
    forwardRef(() => EmployeeModule),
    forwardRef(() => PathModule),
    forwardRef(() => RouteModule),
  ],
  controllers: [EmployeesOnPathController],
  providers: [
    EmployeesOnPathService,
    {
      provide: 'IEmployeesOnPathRepository',
      useClass: EmployeesOnPathRepository,
    },
  ],
  exports: [EmployeesOnPathService],
})
export class EmployeesOnPathModule {}
