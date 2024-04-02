import {
  BadRequestException,
  ConflictException,
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
  UserResponseDto,
} from './dto/user.dto';
import { Users } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
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
    const userSafeData = user.toSafeObject();
    return userSafeData;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
    @Res() res,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);
    res
      .status(HttpStatus.OK)
      .json({ message: 'Password successfully changed' });
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
