import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable, firstValueFrom } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { REFRESH_TOKEN_KEY } from "src/constants/cookie.constants";
import { parseCookies } from "src/utils/cookie";

export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private authService: AuthService) {
    super("jwt");
  }
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log("TEST COOKIE", request?.headers?.cookie);

    try {
      return await firstValueFrom(
        super.canActivate(context) as Observable<boolean>,
      );
      return super.canActivate(context) as boolean;
    } catch (error) {
      try {
        const parsedCookie = parseCookies(request.headers.cookie);

        const refreshToken = parsedCookie[REFRESH_TOKEN_KEY];

        if (!refreshToken) {
          this.logger.log("REFRESH_TOKEN TEST", refreshToken);

          throw new UnauthorizedException("No valid token");
        }

        const { newAccessToken } =
          await this.authService.generateNewAccessTokenByRefreshToken(
            refreshToken,
          );

        request.headers.authorization = `Bearer ${newAccessToken}`;

        return await firstValueFrom(
          super.canActivate(context) as Observable<boolean>,
        );

        return super.canActivate(context) as boolean;
      } catch (error) {
        this.logger.log("TESTSETSETSE", error);
        this.logger.log(
          "HEADER TEST",
          JSON.stringify(request?.cookies),
          JSON.stringify(request),
        );

        throw new UnauthorizedException("Unable to refresh access token");
      }
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
