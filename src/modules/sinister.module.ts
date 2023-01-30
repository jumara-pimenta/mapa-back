import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SinisterController } from 'src/controllers/sinister.controller';
import { SinisterRepository } from 'src/repositories/sinister/sinister.repository';
import { SinisterService } from 'src/services/sinister.service';
import { PathModule } from './path.module';

@Module({
  imports: [PathModule, JwtModule],
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
