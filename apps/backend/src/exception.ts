import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { Response } from "express";

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

    const isInstanceOfError = (variable: unknown): variable is Error => {
      return variable instanceof Error;
    };

    const isInstanceOfHttpException = (
      variable: unknown,
    ): variable is HttpException => {
      return variable instanceof HttpException;
    };

    const status = isInstanceOfHttpException(exception)
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = isInstanceOfError(exception)
      ? exception.message
      : "Internal Server Error";

    if (exception instanceof HttpException) {
      if (exception instanceof NotFoundException) {
        message = exception.message || `${request.url} Path is Not valid`;
      }
    }

    this.logger.error(
      JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      }),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
