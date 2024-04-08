import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RefreshToken } from 'src/database/entities/refreshToken.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Users>;

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
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
      mockUsersRepository.create.mockResolvedValue(createUserDto);
      mockUsersRepository.save.mockResolvedValue(createUserDto);

      expect(await service.create(createUserDto)).toEqual(createUserDto);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a conflict exception if username exists', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(new Users());

      await expect(
        service.create({
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

      await expect(service.findById('invalidUserId')).rejects.toThrow();
    });
  });

  // 다른 메소드들에 대한 테스트 케이스도 비슷한 패턴으로 작성할 수 있습니다.
});
