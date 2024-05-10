import { Test, TestingModule } from "@nestjs/testing";
import { RefreshTokenService } from "./refresh-token.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RefreshToken } from "src/database/entities/refreshToken.entity";
import SharedModule from "src/shared/shared.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SharedService } from "src/shared/shared.service";

describe("RefreshTokenService", () => {
  let service: RefreshTokenService;

  const mockRefreshTokenRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((refreshToken) => Promise.resolve(refreshToken)),
    findOne: jest
      .fn()
      .mockImplementation((options) => Promise.resolve(options.where)),
    delete: jest.fn().mockImplementation((options) => Promise.resolve(options)),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockSharedService = {
    getJwtKeys: jest.fn().mockReturnValue({ privateKey: "test-private-key" }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: SharedService, useValue: mockSharedService },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("saveToken", () => {
    it("should save a refresh token", async () => {
      const refreshToken = await service.saveToken(
        "test-token",
        "test-userId",
        new Date(),
      );
      expect(refreshToken.token).toEqual("test-token");
      expect(mockRefreshTokenRepository.save).toHaveBeenCalledWith(
        refreshToken,
      );
    });
  });

  describe("findToken", () => {
    it("should find a token by token string", async () => {
      const result = await service.findToken("test-token");
      expect(result.token).toEqual("test-token");
      expect(mockRefreshTokenRepository.findOne).toHaveBeenCalled();
    });
  });

  describe("deleteToken", () => {
    it("should delete a token by token string", async () => {
      await service.deleteToken("test-token");
      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith({
        token: "test-token",
      });
    });
  });
});
