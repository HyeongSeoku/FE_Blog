import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
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
    });
  }

  async findById(userId: number): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async delete(userId: number) {
    this.logger.log(`Delete user called: ${userId}`);

    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    this.logger.log(`Delete user successful: ${userId}`);
    return null;
  }
}
