import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "src/auth/auth.service";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "src/constants/cookie.constants";
import { parseCookies } from "src/utils/cookie";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class JwtAuthGuard extends AuthGuard {
  constructor(
    protected readonly authService: AuthService,
    protected readonly jwtService: JwtService,
  ) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger(JwtAuthGuard.name);

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const cookies = parseCookies(request.headers.cookie);
      const accessToken = cookies[ACCESS_TOKEN_KEY];

      if (!accessToken) {
        throw new UnauthorizedException("No access token found");
      }

      request.headers.authorization = `Bearer ${accessToken}`;

      return await super.canActivate(context);
    } catch (error) {
      logger.warn("Access token is invalid or expired. Trying to refresh...", {
        error: error.message,
        stack: error.stack,
      });

      try {
        const parsedCookie = parseCookies(request.headers.cookie);
        const refreshToken = parsedCookie[REFRESH_TOKEN_KEY];

        if (!refreshToken) {
          throw new UnauthorizedException("No valid token");
        }

        const { newAccessToken, newRefreshToken } =
          await this.authService.generateNewAccessTokenByRefreshToken(
            refreshToken,
          );

        request.headers.authorization = `Bearer ${newAccessToken}`;

        request.newTokens = {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };

        // 새 토큰으로 다시 인증 시도
        return await super.canActivate(context);
      } catch (refreshError) {
        //FIXME: 수정필요
        // response.clearCookie(ACCESS_TOKEN_KEY);
        // response.clearCookie(REFRESH_TOKEN_KEY);
        logger.error("Error refreshing token", {
          message: refreshError.message,
          stack: refreshError.stack,
        });
        throw new UnauthorizedException("Unable to refresh access token");
      }
    }
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const logger = new Logger(JwtAuthGuard.name);
    const userFormatting = { ...user, userId: user.sub };

    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      logger.error(`Authentication Error: ${err || info?.message}`, {
        url: request.url,
        headers: request.headers,
        body: request.body,
        info: info,
      });
      return { error: err?.message || info?.message || "Unauthorized" };
    }
    request.user = userFormatting;
    return userFormatting;
  }
}
