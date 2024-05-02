import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { Users } from 'src/database/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { SharedService } from 'src/shared/shared.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from 'src/database/entities/refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedRequest } from './auth.interface';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let refreshTokenService: RefreshTokenService;

  const mockUsersRepository = {
    update: jest.fn(),
  };

  const mockRefreshRepository = {
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    })),
  };

  const mockAuthService = {
    generateToken: jest.fn().mockResolvedValue(undefined),
    generateNewAccessTokenByRefreshToken: jest
      .fn()
      .mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  };

  const mockRefreshTokenService = {
    deleteTokenForUserId: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        UsersService,
        JwtService,
        SharedService,
        ConfigService,
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshRepository,
        },
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    refreshTokenService =
      moduleRef.get<RefreshTokenService>(RefreshTokenService);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('logout', () => {
    it('should return 200 OK with success message on successful logout', async () => {
      const VALID_USER_ID = 'VALID_USER_ID';

      const mockReq = {
        user: { userId: VALID_USER_ID },
      } as AuthenticatedRequest;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.logout.mockResolvedValue(true);

      await authController.logout(mockReq, mockRes);

      expect(mockAuthService.logout).toHaveBeenCalledWith(VALID_USER_ID);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.any(Object),
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should return 401 with fail message on userId is empty', async () => {
      const mockReq = {
        user: { userId: '' },
      } as AuthenticatedRequest;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      } as unknown as Response;

      await authController.logout(mockReq, mockRes);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(0);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User not authenticated',
      });
    });

    it('should return 500 Internal Server Error if logout fails', async () => {
      const INVALID_USER_ID = 'INVALID_USER_ID';
      const mockReq = {
        user: { userId: INVALID_USER_ID },
      } as AuthenticatedRequest;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.logout.mockResolvedValue(false);

      await authController.logout(mockReq, mockRes);
      expect(mockAuthService.logout).toHaveBeenCalledWith(INVALID_USER_ID);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out failed',
      });
    });
  });
});
