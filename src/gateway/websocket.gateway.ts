import { ValidationPipe } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IdUpdateDTO } from '../dtos/employeesOnPath/idUpdateWebsocket';
import { PathService } from '../services/path.service';
import { WebsocketUpdateEmployeesStatusOnPathDTO } from '../dtos/employeesOnPath/websocketUpdateEmployeesOnPath.dto';
import { CurrentLocalDTO } from '../dtos/websocket/currentLocal.dto';
import { StatusRouteDTO } from '../dtos/websocket/StatusRoute.dto';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';
import { RouteService } from '../services/route.service';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { DisembarkEmployeeDTO } from '../dtos/employeesOnPath/disembarkEmployee.dto';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(
    private readonly routeService: RouteService,
    private readonly pathService: PathService,
    private readonly employeesOnPathService: EmployeesOnPathService,
  ) {}
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('client connected:', socket.id);
    });
  }

  @SubscribeMessage('local')
  handleMessage(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    payload: CurrentLocalDTO,
  ): void {
    try {
      this.server.emit(payload.id + '/local', {
        ...payload,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('startRoute')
  async handleRouteStart(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    payload: StatusRouteDTO,
  ): Promise<void> {
    try {
      const data = await this.pathService.startPath(payload.pathId);

      this.server.emit(payload.pathId, {
        ...data,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('finishRoute')
  async handleRouteFinish(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    payload: StatusRouteDTO,
  ): Promise<void> {
    try {
      const data = await this.pathService.finishPath(payload.pathId);
      this.server.emit(payload.pathId, {
        ...data,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('updateEmployee')
  async handleUpdateEmployee(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    payload: WebsocketUpdateEmployeesStatusOnPathDTO,
  ): Promise<void> {
    try {
      await this.employeesOnPathService.updateWebsocket(
        payload.employeeOnPathId,
        payload.payload,
      );
      
      const data = await this.routeService.listById(payload.routeId);

      this.server.emit(payload.pathId, {
        ...data,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('boardingEmployee')
  async handleComfirmEmployee(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    data: IdUpdateDTO,
  ): Promise<Observable<any>> {
    return from(this.employeesOnPathService.onboardEmployee(data)).pipe(
      map((employeeOnPath) => ({
        event: employeeOnPath.id,
        data: employeeOnPath,
      })),
      catchError((error) => {
        const { status, message } = error;

        this.server.except(error).emit('exception', { status, message });
        return throwError(() => new WsException({ status, message }));
      }),
    );
  }

  @SubscribeMessage('disembarkEmployee')
  async handleUncomfirmEmployee(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    data: DisembarkEmployeeDTO,
  ): Promise<void> {
    try {
      const employeeOnPath = await this.employeesOnPathService.offboardEmployee(
        data,
      );

      this.server.emit(employeeOnPath.id, {
        ...employeeOnPath,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('employeeNotComming')
  async handleEmployeeNotComming(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          return new WsException(errors);
        },
      }),
    )
    data: IdUpdateDTO,
  ): Promise<void> {
    try {
      const employeeOnPath =
        await this.employeesOnPathService.employeeNotConfirmed(data);

      this.server.emit(employeeOnPath.id, {
        ...employeeOnPath,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }
}
