import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { FilterDto } from './dto/filter.dto';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { ip, user } = request;
    const userAgent = request.get('user-agent') || '';

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    const errorResponse: FilterDto = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: [
        `${
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message
            : 'Erro desconhecido, procure o administrador'
        }`,
      ],
    };

    this.logger.error(
      `${errorResponse.method} ${errorResponse.code} ${errorResponse.path} - [${user?.employee?.employee_code}] ${userAgent} ${ip}`,
      'ExceptionFilter',
    );

    return response.status(status).json(errorResponse);
  }
}
