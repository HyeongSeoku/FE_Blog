import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ACCESS_TOKEN_KEY } from "src/constants/cookie.constants";
import { parseCookies } from "src/utils/cookie";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token not found");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request["user"] = payload;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const cookies = parseCookies(request.headers.cookie);
    const accessToken = cookies[ACCESS_TOKEN_KEY];

    return accessToken;
  }
}
