import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  
  @WebSocketServer() server:Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: any): string {
    return 'Hello world!';
  }
}
