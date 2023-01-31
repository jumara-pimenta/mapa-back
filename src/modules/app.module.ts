import { SinisterModule } from './sinister.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api.module';
import { RepositoryModule } from './repository.module';
import { DriverModule } from './driver.module';
import { EmployeeModule } from './employee.module';
import { EmployeesOnPathModule } from './employeesOnPath.module';
import { PathModule } from './path.module';
import { PinModule } from './pin.module';
import { RouteModule } from './route.module';
import { RouteHistoryModule } from './routeHistory.module';
import { VehicleModule } from './vehicle.module';
import { EmployeesOnPinModule } from './employeesOnPin.module';
import { WebsocketModule } from './websocket.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    RepositoryModule,
    AuthModule,
    ApiModule,
    DriverModule,
    EmployeeModule,
    EmployeesOnPathModule,
    EmployeesOnPinModule,
    PathModule,
    PinModule,
    RouteModule,
    RouteHistoryModule,
    VehicleModule,
    WebsocketModule,
    SinisterModule,
  ],
})
export class AppModule {}
