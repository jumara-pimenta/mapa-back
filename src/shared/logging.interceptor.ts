import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { ip, method, originalUrl, user } = request;
    const userAgent = request.get('user-agent') || '';

    const { statusCode } = response;

    if (statusCode !== 200 && statusCode !== 201) {
      const now = Date.now();
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `${method} ${statusCode} ${originalUrl} - [${
                user?.employee?.employee_code
              }] ${userAgent} ${ip} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    } else {
      return next.handle();
    }
  }
}
