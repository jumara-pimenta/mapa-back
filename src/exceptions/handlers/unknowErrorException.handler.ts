import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
  
  @Catch()
  export class UnknownErrorExceptionHandler implements ExceptionFilter {
    catch(e: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const date = new Date().toISOString();
      const statusCode =
        e instanceof HttpException
          ? e.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        e instanceof HttpException ? e.message : "internal server error";

      e instanceof HttpException ? undefined : console.log("Caught Exception", e);
  
      const code = e?.response?.code;
  
      const details = e?.response?.message;
  
      response.status(statusCode).json({
        statusCode,
        message,
        timestamp: date,
        path: request.url,
        code,
        details,
      });
    }
  }