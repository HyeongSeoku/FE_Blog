import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Request,
  Res,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/user.dto';
import { Users } from '../database/entities/user.entity';
import { hash, compare } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { AuthenticatedRequest } from 'src/auth/auth.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(createUserDto.password, 10);
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      delete user.password;

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findOneByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'userId',
        'email',
        'username',
        'createdAt',
        'updatedAt',
        'password',
        'isAdmin',
      ],
    });
  }

  async findById(
    userId: string,
  ): Promise<Omit<UserResponseDto, 'userId'> | undefined> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) throw new BadRequestException(`${userId} is not valid user`);
    const userSafeData = user.toSafeObject();
    return userSafeData;
  }

  async changePassword(
    req: AuthenticatedRequest,
    changePasswordDto: ChangePasswordDto,
    @Res() res,
  ) {
    const userId = req?.user?.userId;
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await compare(currentPassword, user.password);

    if (!isPasswordMatching) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedNewPassword = await hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    const refreshToken = req.cookies['refreshToken'];
    await this.refreshTokenService.deleteToken(refreshToken);

    await this.userRepository.save(user);
    res
      .status(HttpStatus.OK)
      .json({ message: 'Password successfully changed', accessToken: '' });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const targetUser = await this.userRepository.findOne({ where: { userId } });

    if (!targetUser)
      throw new BadRequestException(`${userId} is not valid user`);

    if (targetUser.userId !== userId)
      throw new ForbiddenException(`access denied`);

    const { username } = updateUserDto;
    targetUser.username = username;

    await this.userRepository.save(targetUser);
    return targetUser;
  }

  async delete(userId: string) {
    this.logger.log(`Delete user called: ${userId}`);

    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    this.logger.log(`Delete user successful: ${userId}`);
    return null;
  }

  async userInfo(username: string) {
    const targetUser = await this.userRepository.findOne({
      where: { username },
      relations: ['followers', 'following'],
    });

    if (!targetUser) throw new BadRequestException('User does not exist');

    return targetUser;
  }
}
