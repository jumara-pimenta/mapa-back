import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { EmployeesService } from '../employees/employees.service';
import { CarsService } from '../cars/cars.service';
import { DriversService } from '../drivers/drivers.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService,EmployeesService,CarsService,DriversService]
})
export class RoutesModule {}
