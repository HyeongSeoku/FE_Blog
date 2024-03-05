import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, firstValueFrom, tap } from 'rxjs';

export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // async canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean>  {
  //   // 모든 요청에 대한 로그를 남깁니다.
  //   this.logger.debug(`JwtAuthGuard is running`);

  //   try {
  //     const result = await firstValueFrom(super.canActivate(context));
  //     this.logger.debug('After super.canActivate: ', result);

  //     return result;
  //   } catch (e) {
  //     this.logger.error('Exception in JwtAuthGuard: ', e);

  //     throw e;
  //   }
  //   // canActivate 메소드의 기본 동작을 실행합니다.
  // }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug('JwtAuthGuard is running');

    // Observable을 반환하는 경우, firstValueFrom을 사용하여 처리합니다.
    // 여기서는 Observable이나 Promise 둘 다 처리될 수 있도록 합니다.
    const canActivateResult = super.canActivate(context);
    if (canActivateResult instanceof Promise) {
      return canActivateResult.then((result) => {
        this.logger.debug('After super.canActivate: ', result);
        return result;
      });
    } else if (canActivateResult instanceof Observable) {
      return canActivateResult.pipe(
        tap((result) => this.logger.debug('After super.canActivate: ', result)),
      );
    } else {
      // boolean 값인 경우, 바로 반환합니다.
      return canActivateResult;
    }
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
