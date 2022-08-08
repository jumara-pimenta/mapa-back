import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';
import { ValidationException } from './exceptions/validation.exeption';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { ip, user } = request;
    const userAgent = request.get('user-agent') || '';

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: FilterDto = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.validationErrors,
    };

    this.logger.error(
      `${errorResponse.method} ${errorResponse.code} ${errorResponse.path} - [${user?.employee?.employee_code}] ${userAgent} ${ip}`,
      'ValidationFilter',
    );

    return response.status(status).json(errorResponse);
  }
}
