import { Module } from '@nestjs/common';
import { SinisterController } from '../controllers/sinister.controller';
import { SinisterRepository } from '../repositories/sinister/sinister.repository';
import { SinisterService } from '../services/sinister.service';

@Module({
  controllers: [SinisterController],
  providers: [
    SinisterService,
    {
      provide: 'ISinisterRepository',
      useClass: SinisterRepository,
    },
  ],
  exports: [SinisterService],
})
export class SinisterModule {}

