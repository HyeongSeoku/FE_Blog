import { ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class AdminGuard extends AuthGuard('admin') {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('TEST Admin Guard');

    try {
      return super.canActivate(context);
    } catch (e) {
      this.logger.error('Exception in JwtAuthGuard: ', e);
      throw e;
    }
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      // `info`가 `undefined`일 때를 대비한 처리
      const errorMessage = info?.message || 'Authentication error';
      this.logger.error(`Authentication Error: ${err || errorMessage}`);
      // 적절한 예외 발생
      throw err || new ForbiddenException(errorMessage);
    }
    return user;
  }
}
