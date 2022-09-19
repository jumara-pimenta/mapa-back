import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AddressesService } from '../addresses/addresses.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService,AddressesService]
})
export class EmployeesModule {}
