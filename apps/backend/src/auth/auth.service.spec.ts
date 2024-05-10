import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { SharedService } from "src/shared/shared.service";
import { Users } from "src/database/entities/user.entity";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { UsersService } from "src/users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
  RS256_ALGORITHM,
} from "src/constants/auth.constants";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let sharedService: SharedService;

  const MOCK_PRIVATE_KEY = "MOCK_PRIVATE_KEY";
  const MOCK_ACCESS_TOKEN = "MOCK_ACCESS_TOKEN";
  const MOCK_REFRESH_TOKEN = "MOCK_REFRESH_TOKEN";
  const TEST_USER_NAME = "TEST_USER_NAME";
  const TEST_USER_ID = "TEST_USER_ID";
  const TEST_USER_EMAIL = "EMAIL@TEST.COM";
  const TEST_USER_PASSWORD = "TEST_USER_PASSWORD";

  const mockJwtService = {
    signAsync: jest.fn((payload, options) => {
      const token =
        options.expiresIn === REFRESH_TOKEN_EXPIRE
          ? MOCK_REFRESH_TOKEN
          : MOCK_ACCESS_TOKEN;
      return Promise.resolve(token);
    }),
    decode: jest.fn().mockResolvedValue(undefined),
    sign: jest.fn().mockResolvedValue(undefined),
  };
  const mockSharedService = {
    getJwtKeys: jest.fn(() => ({ privateKey: MOCK_PRIVATE_KEY })),
  };
  const mockUsersRepository = {
    update: jest.fn().mockReturnThis(),
  };
  const mockUsersService = {
    findOneByEmail: jest.fn().mockResolvedValue(undefined),
  };
  const mockRefreshTokenService = {
    generateNewAccessToken: jest.fn().mockResolvedValue(undefined),
    saveToken: jest.fn().mockResolvedValue(undefined),
    deleteTokenForUserId: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: SharedService, useValue: mockSharedService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    sharedService = module.get<SharedService>(SharedService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("generateToken create valid tokens", async () => {
    const mockUser: Users = {
      userId: TEST_USER_ID,
      username: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      isAdmin: false,
      followers: [],
      following: [],
    };

    const expectedPayload = {
      username: TEST_USER_NAME,
      sub: TEST_USER_ID,
    };

    const tokens = await service.generateToken(mockUser);

    expect(tokens).toEqual({
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload, {
      privateKey: MOCK_PRIVATE_KEY,
      expiresIn: ACCESS_TOKEN_EXPIRE,
      algorithm: RS256_ALGORITHM,
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload, {
      privateKey: MOCK_PRIVATE_KEY,
      expiresIn: REFRESH_TOKEN_EXPIRE,
      algorithm: RS256_ALGORITHM,
    });
  });
});
