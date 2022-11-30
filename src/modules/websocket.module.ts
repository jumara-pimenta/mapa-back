import { Module } from '@nestjs/common';
import { RouteService } from 'src/services/route.service';
import { WebsocketGateway } from '../gateway/websocket.gateway';
import { RouteModule } from './route.module';

@Module({
  imports: [RouteModule],
  providers: [WebsocketGateway,]
})
export class WebsocketModule {}
