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
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  CreateUserGithubDto,
  GithubUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/user.dto';
import { Users } from '../database/entities/user.entity';
import { hash, compare } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  //FIXME: 해당 부분 완성 필요
  async findOrCreateUserByGithub({
    githubId,
    username,
    email,
    profileImg,
  }: GithubUserDto): Promise<Users> {
    let user = await this.findOneByGithubId(githubId);

    if (!user) {
      // 사용자가 존재하지 않으면 새로운 사용자 생성
      const createUserGithubDto = { username, email, githubId };
      user = await this.createUserFromGithub(createUserGithubDto);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { username, email } = createUserDto;
    await this.checkUserExistence(username, email);

    const hashedPassword = await hash(createUserDto.password, 10);
    const user = this.createUserEntity(createUserDto, hashedPassword);
    await this.saveUser(user);

    return { ...user, password: undefined };
  }

  private async checkUserExistence(username: string, email: string) {
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }
  }

  // FIXME: 해당 부분 이어서 수정
  async createUserFromGithub(
    createUserGithubDto: CreateUserGithubDto,
  ): Promise<any> {}

  private createUserEntity(
    createUserDto: CreateUserDto,
    hashedPassword: string,
  ): Users {
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  private async saveUser(user: Users): Promise<void> {
    await this.userRepository.save(user);
    return;
  }

  async findOneByGithubId(githubId: string): Promise<Users | undefined> {
    return this.userRepository.findOne({
      where: { githubId },
      select: [
        'userId',
        'email',
        'username',
        'createdAt',
        'updatedAt',
        'password',
        'isAdmin',
        'githubId',
        'githubImgUrl',
      ],
    });
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
        'githubId',
        'githubImgUrl',
      ],
    });
  }

  async findById(userId: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) return null;
      return { ...user, password: undefined };
    } catch (e) {
      return null;
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
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

    await this.userRepository.save(user);
    return true;
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

  async deleteUser(userId: string) {
    try {
      const result = await this.userRepository.delete(userId);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }
      return null;
    } catch (e) {
      throw new InternalServerErrorException('Delete User Fail');
    }
  }

  async userInfo(username: string) {
    const targetUser = await this.userRepository.findOne({
      where: { username },
      relations: ['followers', 'following'],
    });

    if (!targetUser) return null;

    return targetUser;
  }
}
