import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../gateway/websocket.gateway';
import { EmployeesOnPathModule } from './employeesOnPath.module';
import { PathModule } from './path.module';
import { RouteModule } from './route.module';

@Module({
  imports: [RouteModule, EmployeesOnPathModule, PathModule],
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
