import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const mockUsersService = {
    userInfo: jest.fn().mockResolvedValue(undefined),
  };
  const mockUsersRepository = {
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('GET info valid user name', async () => {
    const VALID_USER_NAME = 'VALID_USER_NAME';

    const mockValidResult = {
      userId: 'VALID_USER_ID',
      username: VALID_USER_NAME,
      email: 'VALID@email.com',
      createdAt: '2024-04-01T04:17:30.000Z',
      updatedAt: '2024-04-11T07:38:30.000Z',
      lastLogin: '2024-04-12T02:55:14.000Z',
      isAdmin: false,
      followers: [],
      following: [],
    };

    mockUsersService.userInfo.mockResolvedValue(mockValidResult);
    const result = await usersController.getUserInfo(VALID_USER_NAME);
    expect(mockUsersService.userInfo).toHaveBeenCalledWith(VALID_USER_NAME);

    expect(result).toEqual(mockValidResult);
  });

  it('GET info empty username', async () => {
    const EMPTY_USER_NAME = '';
    const FAIL_RESPONSE = {
      error: 'Bad Request',
      message: 'username is required',
      statusCode: 400,
    };

    try {
      await usersController.getUserInfo(EMPTY_USER_NAME);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.response).toEqual(FAIL_RESPONSE);
    }
  });

  it('GET info user does not exist', async () => {
    const INVALID_USER_NAME = 'INVALID_USER_NAME';
    const FAIL_NOT_FOUND_RESPONSE = {
      error: 'Not Found',
      message: 'User does not exist',
      statusCode: 404,
    };

    mockUsersService.userInfo.mockResolvedValue(null);
    try {
      await usersController.getUserInfo(INVALID_USER_NAME);
      expect(true).toBe(false);
    } catch (error) {
      expect(mockUsersService.userInfo).toHaveBeenCalledWith(INVALID_USER_NAME);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.response).toEqual(FAIL_NOT_FOUND_RESPONSE);
    }
  });
});
