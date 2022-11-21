import { ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, WsResponse, WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import { CurrentLocalDTO } from 'src/dtos/websocket/currentLocal.dto';

@WebSocketGateway()
export class WebsocketGateway {

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
      this.server.except(error);
      throw new WsException(error.message);


    }
    // const 


  }
}
