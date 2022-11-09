import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { IntegrationException } from "../integrationException";

@Catch(IntegrationException)
export class IntegrationExceptionHandler implements ExceptionFilter {
    catch(exception: IntegrationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const date = new Date().toISOString()
        const statusCode = HttpStatus.UNPROCESSABLE_ENTITY
        const message = 'Integration error.'
        const service = exception.message

        response.status(statusCode).json({
            message,
            statusCode,
            timestamp: date,
            path: request.url,
            service
        })
    }
}