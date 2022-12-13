import { ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, WsResponse, WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import { UpdateEmployeesOnPathDTO } from 'src/dtos/employeesOnPath/updateEmployeesOnPath.dto';
import { WebsocketUpdateEmployeesStatusOnPathDTO } from 'src/dtos/employeesOnPath/websocketUpdateEmployeesOnPath.dto';
import { CurrentLocalDTO } from 'src/dtos/websocket/currentLocal.dto';
import { StatusRouteDTO } from 'src/dtos/websocket/StatusRoute.dto';
import { EmployeesOnPathService } from 'src/services/employeesOnPath.service';
import { RouteService } from 'src/services/route.service';
import { getDateInLocaleTime } from 'src/utils/date.service';
import { EStatusRoute } from 'src/utils/ETypes';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(
    private readonly routeService: RouteService,
    private readonly employeesOnPathService: EmployeesOnPathService,
  ) { }
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Client connected');
    }
    );
  }

  @SubscribeMessage('local')
  handleMessage(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: CurrentLocalDTO): void {
    try {
      this.server.emit(payload.id, {
        ...payload
      });

    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }

  }

  @SubscribeMessage('startRoute')
  async handleRouteStart(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: StatusRouteDTO): Promise<void> {
    try {
      const startAt = {
        ...payload,
        route: {
          ...payload.route,
          status: 'EM ANDAMENTO' as EStatusRoute
        },
        path: {
          ...payload.path,
          startedAt: getDateInLocaleTime(new Date()),
          finishedAt: null,
        }
      }

      const data = await this.routeService.updateWebsocket(startAt);

      this.server.emit(payload.routeId, {
        ...data
      });

    } catch (error) {
      console.log(error);
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('finishRoute')
  async handleRouteFinish(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: StatusRouteDTO): Promise<void> {
    try {

      const finishedAt = {
        ...payload,
        route: {
          ...payload.route,
          status: 'PENDENTE' as EStatusRoute
        },
        path: {
          ...payload.path,
          finishedAt: getDateInLocaleTime(new Date())
        }
      }

      const data = await this.routeService.updateWebsocket(finishedAt);

      this.server.emit(payload.routeId, {
        ...data
      });


    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('updateEmployee')
  async handleUpdateEmployee(@MessageBody(new ValidationPipe({
    exceptionFactory: (errors) => {
      console.log(errors);
      return new WsException(errors)
    }
  })) payload: WebsocketUpdateEmployeesStatusOnPathDTO): Promise<void> {
    try {
      console.log("==>==>=>",payload);

      
      
      await this.employeesOnPathService.updateWebsocket(payload.employeeOnPathId,payload.payload);
      const data = await this.routeService.listById(payload.routeId);

      this.server.emit(payload.routeId, {
        ...data
      });
      
   
}
    catch (error) {
      console.log(error);
      
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }
}
