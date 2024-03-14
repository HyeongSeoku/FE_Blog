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

    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof Error) {
      // 일반 Error인 경우, 500 상태와 함께 에러 메시지를 설정
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message; // Error 객체의 message 사용
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    // 로깅 로직을 커스터마이징하여 메시지와 함께 추가 정보를 기록
    this.logger.error(`[${status}] ${message} - Path: ${request.url}`);

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
