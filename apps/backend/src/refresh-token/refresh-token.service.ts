import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/database/entities/refreshToken.entity";
import { LessThan, MoreThan, Repository } from "typeorm";
import { SharedService } from "src/shared/shared.service";
import { JwtService } from "@nestjs/jwt";
import {
  ACCESS_TOKEN_EXPIRE,
  RS256_ALGORITHM,
} from "src/constants/auth.constants";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private sharedService: SharedService,
  ) {}

  private logger = new Logger(RefreshTokenService.name);

  async deleteExpiredTokens() {
    const currentDate = new Date();
    await this.refreshTokenRepository.delete({
      expiryDate: LessThan(currentDate),
    });
    this.logger.log("Expired tokens have been deleted.");
  }

  async findToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, expiryDate: MoreThan(new Date()) },
      relations: ["users"],
    });
  }

  async saveToken(
    token: string,
    userId: string,
    expiryDate: Date,
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      token: token,
      users: { userId },
      expiryDate: expiryDate,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async deleteToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async deleteTokenForUserId(userId: string): Promise<void> {
    try {
      await this.refreshTokenRepository
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("userId = :userId", { userId })
        .execute();
    } catch (error) {
      console.error("Error deleting token for user ID:", userId, error);
      throw error;
    }
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const targetRefreshToken = await this.findToken(token);
    return !!targetRefreshToken;
  }

  async generateNewAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const isValidRefreshToken = await this.validateRefreshToken(refreshToken);
      if (!isValidRefreshToken) {
        throw new Error("Invalid refreshToken");
      }

      await this.deleteToken(refreshToken);

      const { privateKey } = this.sharedService.getJwtKeys();

      const decoded = this.jwtService.verify(refreshToken, {
        secret: privateKey,
      });
      if (decoded && decoded.username && decoded.sub) {
        const payload = { username: decoded.username, sub: decoded.sub };
        const accessToken = this.jwtService.sign(payload, {
          privateKey: privateKey,
          expiresIn: ACCESS_TOKEN_EXPIRE,
          algorithm: RS256_ALGORITHM,
        });

        return accessToken;
      }
    } catch (e) {
      return null;
    }
  }
}
