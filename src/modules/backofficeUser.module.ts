import { Module, forwardRef } from '@nestjs/common';
import { BackofficeUserService } from '../services/backOfficeUser.service';
import { AuthModule } from './auth.module';
import { BackOfficeUserRepository } from '../repositories/backOfficeUser/backOffice.repository';

@Module({
  imports: [forwardRef(() => AuthModule),],
  providers: [
    BackofficeUserService,
    {
      provide: 'IBackOfficeUserRepository',
      useClass: BackOfficeUserRepository,
    },
  ],
  exports: [BackofficeUserService]
})
export class BackofficeUserModule {}
