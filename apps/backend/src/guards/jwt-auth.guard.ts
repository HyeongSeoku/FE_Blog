import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenExpiredError } from "jsonwebtoken"; // jsonwebtoken에서 TokenExpiredError를 가져와야 함
import { AuthGuard } from "@nestjs/passport";
import { from, Observable, firstValueFrom } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { REFRESH_TOKEN_KEY } from "src/constants/cookie.constants";
import { parseCookies } from "src/utils/cookie";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly authService: AuthService) {
    super();
  }
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.log("TEST COOKIE", request?.headers?.cookie);

    try {
      // 기존 토큰으로 인증 시도
      await firstValueFrom(
        from(
          super.canActivate(context) as Promise<boolean>,
        ) as Observable<boolean>,
      );
      return true;
    } catch (error) {
      this.logger.warn(
        "Access token is invalid or expired. Trying to refresh...",
        {
          error: error.message,
          stack: error.stack,
        },
      );

      // 토큰 인증 실패 시 토큰 재발급 시도
      try {
        const parsedCookie = parseCookies(request.headers.cookie);
        const refreshToken = parsedCookie[REFRESH_TOKEN_KEY];

        if (!refreshToken) {
          this.logger.log("No refresh token found.");
          throw new UnauthorizedException("No valid token");
        }

        // 새로 발급된 토큰으로 인증 시도
        const { newAccessToken } =
          await this.authService.generateNewAccessTokenByRefreshToken(
            refreshToken,
          );

        this.logger.log(
          "New access token generated successfully.",
          newAccessToken,
        );

        // 요청 헤더에 새로운 액세스 토큰 설정
        request.headers.authorization = `Bearer ${newAccessToken}`;

        // 새 토큰으로 다시 인증 시도
        await firstValueFrom(
          from(
            super.canActivate(context) as Promise<boolean>,
          ) as Observable<boolean>,
        );
        return true;
      } catch (refreshError) {
        // 재발급 과정에서 발생한 오류 처리
        this.logger.error("Error refreshing token", {
          message: refreshError.message,
          stack: refreshError.stack,
        });
        throw new UnauthorizedException("Unable to refresh access token");
      }
    }
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      if (err instanceof TokenExpiredError) {
        this.logger.warn("Token expired", {
          url: request.url,
          headers: request.headers,
          body: request.body,
        });
        return { error: "Token expired" };
      } else {
        this.logger.error(`Authentication Error: ${err || info?.message}`, {
          url: request.url,
          headers: request.headers,
          body: request.body,
        });
        return { error: err?.message || info?.message || "Unauthorized" };
      }
    }
    return user;
  }
}
