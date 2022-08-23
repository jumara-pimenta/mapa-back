import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppMessageError, PrismaMessageError } from 'src/constants/exceptions';

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

    let status = 0;
    const message = [];
    if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message.push(PrismaMessageError.GENERAL_VALIDATION_DATA_ERROR);
    } else if (exception.getStatus) {
      status = exception.getStatus();
      message.push(exception.message);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message.push(AppMessageError.UNKNOWN_ERROR);
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    const errorResponse: FilterDto = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    this.logger.error(
      `${errorResponse.method} ${errorResponse.code} ${errorResponse.path} - [${user?.employee?.employee_code}] ${userAgent} ${ip}`,
      'ExceptionFilter',
    );

    return response.status(status).json(errorResponse);
  }
}
