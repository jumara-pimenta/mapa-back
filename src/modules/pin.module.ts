import { Module, forwardRef } from '@nestjs/common';
import { PinController } from '../controllers/pin.controller';
import { PinRepository } from '../repositories/pin/pin.repository';
import { PinService } from '../services/pin.service';
import { EmployeesOnPinModule } from './employeesOnPin.module';

@Module({
  imports: [forwardRef(() => EmployeesOnPinModule)],
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
