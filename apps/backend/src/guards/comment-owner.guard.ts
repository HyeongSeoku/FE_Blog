import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { CommentsService } from "src/comments/comments.service";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CommentOwnerGuard extends AuthGuard {
  constructor(
    private commentsService: CommentsService,
    protected readonly jwtService: JwtService,
  ) {
    super(jwtService);
  }

  private readonly logger = new Logger(CommentOwnerGuard.name);

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    const commentId = request.params.commentId;
    if (commentId) {
      const commentData = await this.commentsService.findOneComment(commentId);

      const isCommentOwner =
        commentData.user && commentData.user.userId === user.sub;

      if (isCommentOwner) return true;

      throw new ForbiddenException("You are not the owner of the comment");
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
