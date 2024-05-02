import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RefreshToken } from 'src/database/entities/refreshToken.entity';
import { JwtService } from '@nestjs/jwt';
import { SharedService } from 'src/shared/shared.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Users>;

  const mockUsersRepository = {
    create: jest.fn().mockReturnValue(undefined),
    save: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockRefreshTokenService = {
    deleteToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
        RefreshTokenService,
        JwtService,
        SharedService,
        ConfigService,
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        username: 'testUser',
        email: 'test@test.com',
        password: 'password',
      };
      const hashedPassword = await hash(createUserDto.password, 10);

      const userWithHashedPassword = {
        ...createUserDto,
        password: hashedPassword,
      };

      mockUsersRepository.create.mockReturnValue(userWithHashedPassword);
      mockUsersRepository.save.mockResolvedValue(userWithHashedPassword);

      const result = await service.createUser(createUserDto);
      const createdUser = userRepository.create(userWithHashedPassword);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...userWithHashedPassword,
        password: expect.any(String),
      });

      expect(userRepository.save).toHaveBeenCalledWith(createdUser);

      expect(result).toEqual({
        ...createdUser,
        password: undefined,
      });
    });

    it('should throw a conflict exception if username exists', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(new Users());

      await expect(
        service.createUser({
          username: 'testUser',
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const userId = 'someUserId';
      const expectedUser = {
        userId,
        username: 'testUser',
        email: 'test@test.com',
      };
      mockUsersRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findById(userId);
      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should throw an exception if user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      expect(await service.findById('invalidUserId')).toEqual(null);
    });
  });
});
