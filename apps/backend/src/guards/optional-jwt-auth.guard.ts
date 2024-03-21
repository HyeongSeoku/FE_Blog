import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return from(
      super.canActivate(context) as Promise<boolean> | Observable<boolean>,
    ).pipe(
      catchError((e) => {
        // 에러 로깅
        this.logger.error('Exception in OptionalJwtAuthGuard: ', e);
        // 에러가 발생해도 요청을 계속 진행하도록 true 반환
        return of(true);
      }),
    );
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err) {
      if (info && info.name === 'JsonWebTokenError') {
        this.logger.error(`Authentication Error: ${info.message}`);
        throw new UnauthorizedException(info.message);
      }
      this.logger.log('Proceeding with anonymous access or valid token.');
    }
    return user;
  }
}
