// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/users.service';
// import { AuthenticatedRequest } from './auth.interface';
// import { Users } from 'src/database/entities/user.entity';
// import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
// import { Response } from 'express';
// import { HttpStatus, INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './auth.interface';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { HttpStatus } from '@nestjs/common';

// describe('AuthController', () => {
//   let app: INestApplication;
//   let controller: AuthController;
//   let authService: AuthService;
//   let usersService: UsersService;
//   let refreshTokenService: RefreshTokenService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             login: jest.fn(),
//             logout: jest.fn().mockImplementation(() => Promise.resolve()),
//             generateNewAccessTokenByRefreshToken: jest.fn(),
//           },
//         },
//         {
//           provide: UsersService,
//           useValue: {
//             create: jest.fn(),
//             findById: jest.fn(),
//             delete: jest.fn(),
//             changePassword: jest.fn(),
//             update: jest.fn(),
//           },
//         },
//         {
//           provide: RefreshTokenService,
//           useValue: {
//             deleteTokenForUserId: jest.fn().mockResolvedValue(undefined),
//           },
//         },
//       ],
//     }).compile();

//     app = module.createNestApplication();
//     await app.init();

//     controller = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//     usersService = module.get<UsersService>(UsersService);
//     refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('login', () => {
//     it('로그인 성공 테스트', async () => {
//       const user = new Users();
//       user.username = 'someUserName';
//       user.userId = 'someUserId';
//       user.email = 'some@email.com';
//       user.createdAt = new Date();
//       user.updatedAt = new Date();
//       user.lastLogin = new Date();
//       user.isAdmin = false;
//       user.followers = [];
//       user.following = [];

//       const req: AuthenticatedRequest = {
//         user,
//       } as AuthenticatedRequest;

//       const res: any = { json: jest.fn() }; // Express의 Response 객체를 모의하기 위해 any 타입 사용

//       await controller.login(req, res); // req와 res를 any로 캐스팅
//       expect(authService.login).toHaveBeenCalled();
//     });
//   });

//   describe('logout', () => {
//     it('로그아웃 성공 시 성공 메시지를 반환해야 함', async () => {
//       const req: AuthenticatedRequest = {
//         user: { userId: 'testUserId' },
//       } as AuthenticatedRequest;
//       const res: Partial<Response> = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn().mockReturnThis(),
//         cookie: jest.fn().mockReturnThis(),
//       };

//       await controller.logout(req, res as Response);

//       expect(authService.logout).toHaveBeenCalled();
//       // expect(res.status).toHaveBeenCalledWith(200);
//       // expect(res.json).toHaveBeenCalledWith({
//       //   message: 'Logged out successfully',
//       // });
//     });

//     it('사용자 ID가 없는 경우 401 Unauthorized 반환', async () => {
//       // Arrange
//       const req: Partial<AuthenticatedRequest> = {
//         user: {},
//       } as AuthenticatedRequest;
//       const res: Partial<Response> = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn().mockReturnThis(),
//       };

//       // Act
//       await authService.logout(req as AuthenticatedRequest, res as Response);

//       // Assert
//       expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
//       expect(res.json).toHaveBeenCalledWith({
//         message: 'User not authenticated',
//       });
//     });
//   });

//   afterEach(async () => {
//     await app.close();
//   });
// });

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      logout: jest
        .fn()
        .mockImplementation((req: AuthenticatedRequest, res: Response) => {
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Logged out successfully' });
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: {
            // 필요한 메소드를 모의합니다.
          },
        },
        {
          provide: 'UsersRepository', // UsersService 내에서 사용하는 실제 토큰 이름을 사용하세요.
          useValue: {
            // 리포지토리에서 필요한 메소드를 모의합니다.
          },
        },
        { provide: RefreshTokenService, useValue: {} },
        {
          provide: 'RefreshTokenRepository',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('로그아웃 성공 시 성공 메시지를 반환해야 함', async () => {
    const req: Partial<AuthenticatedRequest> = {
      user: { userId: 'testUserId' },
    } as AuthenticatedRequest;
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<
        typeof res.status
      >,
      json: jest.fn().mockReturnThis() as jest.MockedFunction<typeof res.json>,
      cookie: jest.fn().mockReturnThis() as jest.MockedFunction<
        typeof res.cookie
      >,
    };

    await controller.logout(req as AuthenticatedRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged out successfully',
    });
  });
});
