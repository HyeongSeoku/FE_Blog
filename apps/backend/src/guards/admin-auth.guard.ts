import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  private readonly logger = new Logger(AdminGuard.name);
  constructor(
    private usersService: UsersService,
    protected readonly authService: AuthService,
    protected readonly jwtService: JwtService,
  ) {
    super(authService, jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    const userData = await this.usersService.findById(user.sub);

    if (!userData?.isAdmin) {
      throw new UnauthorizedException("Access Denied");
    }

    const handleRequestResult = this.handleRequest(null, user, null, context);
    request.user = handleRequestResult;

    return result;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userFormatting = { ...user, userId: user.sub };

    if (err || !user) {
      const errorMessage = info?.message || "Authentication error";
      this.logger.error(`Authentication Error: ${err || errorMessage}`);
      throw err || new ForbiddenException(errorMessage);
    }
    request.user = userFormatting;

    return userFormatting;
  }
}
