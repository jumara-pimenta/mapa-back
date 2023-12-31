import { BackofficeUserModule } from './backofficeUser.module';
import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from '../configs/authentication/auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { RequestContextModule } from 'nestjs-request-context';
import { CoreServiceIntegration } from '../integrations/services/coreService/core.service.integration';
import { BackOfficeUserRepository } from '../repositories/backOfficeUser/backOffice.repository';
import { PrismaModule } from '../database/prisma.module';
import { EmployeeModule } from './employee.module';
import { DriverModule } from './driver.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      signOptions: {
        expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN,
      },
    }),
    forwardRef(() => BackofficeUserModule),
    EmployeeModule,
    DriverModule,
    RequestContextModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: 'ICoreServiceIntegration',
      useClass: CoreServiceIntegration,
    },
    {
      provide: 'IBackOfficeUserRepository',
      useClass: BackOfficeUserRepository,
    },
  ],
})
export class AuthModule {}
