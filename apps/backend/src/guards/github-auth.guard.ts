import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    if (err) {
      const query = req.query;
      return res.redirect(
        `${process.env.FE_BASE_URL}/login?error=${query.error}&error_description=${encodeURIComponent(query.error_description)}`,
      );
    }
    return user;
  }
}
