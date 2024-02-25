import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // 모든 요청에 대한 로그를 남깁니다.
    this.logger.debug(`JwtAuthGuard is running`);

    // canActivate 메소드의 기본 동작을 실행합니다.
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.log(`Authentication ${err} info: ${info}`);
    this.logger.log(`Authentication info`);

    // 인증에 실패하면 에러를 로깅합니다.
    if (err || !user) {
      this.logger.error(`Authentication Error: ${err || info.message}`);
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
