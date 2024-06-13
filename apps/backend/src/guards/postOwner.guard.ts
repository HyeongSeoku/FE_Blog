import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { PostsService } from "src/posts/posts.service";
import { UsersService } from "src/users/users.service";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PostOwnerGuard extends AuthGuard {
  private readonly logger = new Logger(PostOwnerGuard.name);

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    protected readonly jwtService: JwtService,
  ) {
    super(jwtService);
  }
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException();

    const userData = await this.usersService.findById(user.sub);

    if (!userData) {
      throw new UnauthorizedException("Access Denied");
    }

    const postData = await this.postsService.findOnePost(request.params.postId);

    if (!postData) throw new Error("Post does not exist!");

    if (postData.user.userId !== user.sub)
      throw new ForbiddenException("You are not Owner");

    return true;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      const errorMessage = info?.message || "Authentication error";
      this.logger.error(`Authentication Error: ${err || errorMessage}`);
      throw err || new ForbiddenException(errorMessage);
    }
    return user;
  }
}
