import { Module } from '@nestjs/common';
import { PinController } from '../controllers/pin.controller';
import { PinRepository } from '../repositories/pin/pin.repository';
import { PinService } from '../services/pin.service';

@Module({
  controllers: [PinController],
  providers: [
    PinService,
    {
      provide: 'IPinRepository',
      useClass: PinRepository,
    },
  ],
  exports: [PinService],
})
export class PinModule {}
