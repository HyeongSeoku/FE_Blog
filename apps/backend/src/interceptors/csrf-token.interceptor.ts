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
    logger.log('CSRF TEST', request.headers);

    return next.handle().pipe(
      tap(() => {
        const newCsrfToken = request.csrfToken();
        response.cookie('XSRF-TOKEN', newCsrfToken);
      }),
    );
  }
}
