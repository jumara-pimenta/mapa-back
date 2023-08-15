import { ValidationPipe } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnboardEmployeeDTO } from '../dtos/employeesOnPath/onboardEmployee.dto';
import { PathService } from '../services/path.service';
import { WebsocketUpdateEmployeesStatusOnPathDTO } from '../dtos/employeesOnPath/websocketUpdateEmployeesOnPath.dto';
import { CurrentLocalDTO } from '../dtos/websocket/currentLocal.dto';
import { StatusRouteDTO } from '../dtos/websocket/StatusRoute.dto';
import { EmployeesOnPathService } from '../services/employeesOnPath.service';
import { RouteService } from '../services/route.service';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { DisembarkEmployeeDTO } from '../dtos/employeesOnPath/disembarkEmployee.dto';
import { formatTimeInManausTimeZone } from '../utils/date.service';

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
      const refreshedRoute = await this.pathService.startPath(payload.pathId);

      for await (const employee of refreshedRoute.employeesOnPath) {
        this.server.emit(employee.id, {
          id: employee.id,
          details: {
            title: `Rota Iniciada: ${refreshedRoute.routeDescription}`,
            message: `A sua rota de ${refreshedRoute.type} foi iniciada às ${formatTimeInManausTimeZone(refreshedRoute.startedAt)}. Confirme a sua presença e prepare-se para embarcar!`,
          },
        });
      }

      this.server.emit('admin', {
        ...refreshedRoute,
      });

      this.server.emit(payload.pathId, {
        ...refreshedRoute,
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
      const refreshedRoute = await this.pathService.finishPath(payload.pathId);
      
      for await (const employee of refreshedRoute.employeesOnPath) {
        this.server.emit(employee.id, {
          id: employee.id,
          details: {
            title: `Rota Finalizada: ${refreshedRoute.routeDescription}`,
            message: `A sua rota de ${refreshedRoute.type} foi finalizada às ${formatTimeInManausTimeZone(refreshedRoute.startedAt)}!`,
          },
        });
      }

      this.server.emit('admin', {
        ...refreshedRoute,
      });

      this.server.emit(payload.pathId, {
        ...refreshedRoute,
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
    data: OnboardEmployeeDTO,
  ): Promise<Observable<any>> {
    return from(this.employeesOnPathService.onboardEmployee(data)).pipe(
      map((employeeOnPath) => {
        this.server.emit('admin', employeeOnPath);

        return {
          event: employeeOnPath.id,
          data: employeeOnPath,
        };
      }),
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

      this.server.emit('admin', {
        ...employeeOnPath,
      });

      this.server.emit(employeeOnPath.id, {
        ...employeeOnPath,
      });
    } catch (error) {
      this.server.except(error).emit('error', error);
      throw new WsException(error.message);
    }
  }
}
