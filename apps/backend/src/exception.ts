import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (response.headersSent) {
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.FORBIDDEN) {
      const err = exception as HttpException;
      const message = err.getResponse();
      this.logger.error(`CSRF error: ${message} - Path: ${request.url}`);
    }

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    response
      .status(status) // 'status' 메서드 호출
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      });

    // ... 기타 로깅과 예외 처리 로직
  }
}
