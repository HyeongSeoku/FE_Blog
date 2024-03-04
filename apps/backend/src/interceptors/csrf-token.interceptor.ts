import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CsrfTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const logger = new Logger(CsrfTokenInterceptor.name);

    return next.handle().pipe(
      tap(() => {
        logger.log('TEST BEFORE csrf token');
        const newCsrfToken = request.csrfToken();
        logger.log('TEST newCsrfToken');

        response.cookie('XSRF-TOKEN', newCsrfToken);
      }),
    );
  }
}
