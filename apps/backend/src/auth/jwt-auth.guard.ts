import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  Observable,
  TimeoutError,
  catchError,
  firstValueFrom,
  tap,
  throwError,
  timeout,
} from 'rxjs';

export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (e) {
      this.logger.error('Exception in JwtAuthGuard: ', e);
      throw e;
    }
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      this.logger.error(`Authentication Error: ${err || info.message}`);
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
