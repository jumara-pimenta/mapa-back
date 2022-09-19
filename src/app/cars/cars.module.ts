import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { AddressesService } from '../addresses/addresses.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
