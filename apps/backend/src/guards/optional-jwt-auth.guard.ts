import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable, from, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return from(
      super.canActivate(context) as Promise<boolean> | Observable<boolean>,
    ).pipe(
      catchError((e) => {
        this.logger.error("Exception in OptionalJwtAuthGuard: ", e);
        throw e;
      }),
    );
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (
      info &&
      (info.name === "JsonWebTokenError" || info.name === "TokenExpiredError")
    ) {
      this.logger.error(`JWT Authentication Error: ${info.message}`);
      throw new UnauthorizedException(info.message);
    }
    if (err) {
      this.logger.error(`Authentication Error: ${err.message}`);
    }

    return user || null;
  }
}
