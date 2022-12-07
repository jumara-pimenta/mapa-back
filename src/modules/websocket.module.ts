import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../gateway/websocket.gateway';
import { EmployeesOnPathModule } from './employeesOnPath.module';
import { RouteModule } from './route.module';

@Module({
  imports: [RouteModule, EmployeesOnPathModule,],
  providers: [WebsocketGateway,]
})
export class WebsocketModule {}
