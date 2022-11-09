import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Module({
  controllers: [],
  providers: [AddressesService]
})
export class AddressesModule {}
