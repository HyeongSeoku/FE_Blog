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

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    if (status === HttpStatus.FORBIDDEN) {
      this.logger.error(`CSRF error: ${message} - Path: ${request.url}`);
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      const pastDate = new Date(0);
      this.logger.log(`Unauthorized Error ${message}`);

      // 쿠키 만료
      response.cookie('accessToken', '', {
        httpOnly: true,
        expires: pastDate,
      });
      response.cookie('refreshToken', '', {
        httpOnly: true,
        expires: pastDate,
      });
    }

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
