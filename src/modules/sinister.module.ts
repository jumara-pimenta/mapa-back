import { Module } from '@nestjs/common';
import { SinisterController } from 'src/controllers/sinister.controller';
import { SinisterRepository } from 'src/repositories/sinister/sinister.repository';
import { SinisterService } from 'src/services/sinister.service';

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

