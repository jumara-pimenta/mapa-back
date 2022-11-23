import { ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, WsResponse, WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import { CurrentLocalDTO } from 'src/dtos/websocket/currentLocal.dto';
import { StatusRouteDTO } from 'src/dtos/websocket/StatusRoute.dto';
import { RouteService } from 'src/services/route.service';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(
    private readonly routeService: RouteService
  ) { }
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Client connected');
    }
    );
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: CurrentLocalDTO): void {
    try {
      this.server.emit('onMessage', {
        message: 'New message from server',
        content: payload
      });

    } catch (error) {
      console.log(error);
      this.server.except(error).emit('onMessage', error);
      throw new WsException(error.message);
    }

  }
  @SubscribeMessage('StatusRouteDTO')
  async handleRouteStatus(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: StatusRouteDTO): Promise<void> {
    try {
      const data = await this.routeService.updateWebsocket(payload.id, payload.route, payload.path);

      this.server.emit(data.id, {
        message: data
      });

    } catch (error) {
      console.log(error);
      this.server.except(error).emit('onMessage', error);
      throw new WsException(error.message);
    }
  }
}
