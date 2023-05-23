import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SinisterController } from '../controllers/sinister.controller';
import { SinisterRepository } from '../repositories/sinister/sinister.repository';
import { SinisterService } from '../services/sinister.service';
import { PathModule } from './path.module';

@Module({
  imports: [forwardRef(() => PathModule), JwtModule],
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
