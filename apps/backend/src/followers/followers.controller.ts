import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { FollowDto } from './followers.dto';

@Controller('followers')
export class FollowersController {
  constructor(private followsService: FollowersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  async followUser(
    @Req() req: AuthenticatedRequest,
    @Body() followDto: FollowDto,
  ) {
    return await this.followsService.following(req?.user?.userId, followDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow')
  async unfollowUser(
    @Req() req: AuthenticatedRequest,
    @Body() followDto: FollowDto,
  ) {
    return await this.followsService.unFollowing(req?.user?.userId, followDto);
  }
}
