import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PostOwnerGuard } from './postOwner.guard';
import { CommentOwnerGuard } from './comment-owner.guard';

@Injectable()
export class PostCommentOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private postOwnerGuard: PostOwnerGuard,
    private commentOwnerGuard: CommentOwnerGuard,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateRequest(context);
  }

  async validateRequest(context: ExecutionContext): Promise<boolean> {
    try {
      const guardOneResult = await this.postOwnerGuard.canActivate(context);
      if (guardOneResult) {
        return true;
      }
    } catch (error) {}

    try {
      const guardTwoResult = await this.commentOwnerGuard.canActivate(context);
      if (guardTwoResult) {
        return true;
      }
    } catch (error) {}

    throw new ForbiddenException('Access Denied');
  }
}
