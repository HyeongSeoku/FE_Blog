import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { CommentsService } from "src/comments/comments.service";
import { UsersService } from "src/users/users.service";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PostCommentOwnerGuard extends AuthGuard {
  constructor(
    private commentsService: CommentsService,
    private usersService: UsersService,
    protected readonly jwtService: JwtService,
  ) {
    super(jwtService);
  }

  private logger = new Logger(PostCommentOwnerGuard.name);

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const commentId = request.params.commentId;

    if (!user) throw new UnauthorizedException();

    const userData = await this.usersService.findById(user.sub);

    if (!userData) {
      throw new UnauthorizedException("Access Denied");
    }

    const commentData = await this.commentsService.findOneComment(commentId);

    const isPostOwner = commentData.post.user.userId === user.sub;
    const isCommentOwner = commentData?.user?.userId === user.sub;

    if (!isPostOwner && !isCommentOwner)
      throw new ForbiddenException("You are not the owner of the post");

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
