import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Followers } from "src/database/entities/followers.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { FollowDto } from "./followers.dto";

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Followers)
    private followersRepository: Repository<Followers>,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger = new Logger(FollowersService.name);

  async following(userId: string, followDto: FollowDto) {
    const { followingId } = followDto;

    if (!followingId) throw new BadRequestException("follwingId is required");

    if (userId === followingId)
      throw new BadRequestException(
        "Invalid action. A user cannot follow their own account",
      );

    const targetUser = await this.usersService.findById(followingId);

    const alreadyFollow = await this.followersRepository.findOne({
      where: {
        followerId: userId,
        followingId,
      },
    });
    if (alreadyFollow)
      throw new BadRequestException(
        `Invalid action. You already follow ${targetUser.username}`,
      );

    const followResult = this.followersRepository.create({
      followerId: userId,
      followingId,
    });

    await this.followersRepository.save(followResult);

    return followResult;
  }

  async unFollowing(userId: string, followDto: FollowDto) {
    const { followingId } = followDto;

    if (!followingId) throw new BadRequestException("follwingId is required");

    if (userId === followingId)
      throw new BadRequestException(
        "Invalid action. A user cannot unfollow their own account",
      );

    const targetUser = await this.usersService.findById(followingId);

    const followRelation = await this.followersRepository.findOne({
      where: {
        followerId: userId,
        followingId,
      },
    });

    if (!followRelation)
      throw new BadRequestException(
        `Invalid action. You do not follow ${targetUser.username}`,
      );

    await this.followersRepository.delete({
      followerId: userId,
      followingId,
    });
  }
}
