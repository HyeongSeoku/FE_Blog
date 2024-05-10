import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PostsService } from "src/posts/posts.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PostOwnerGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(PostOwnerGuard.name);

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException();

    const userData = await this.usersService.findById(user.userId);

    if (!userData) {
      throw new UnauthorizedException("Access Denied");
    }

    const postData = await this.postsService.findOnePost(request.params.postId);

    if (!postData) throw new Error("Post does not exist!");

    if (postData.user.userId !== user.userId)
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
