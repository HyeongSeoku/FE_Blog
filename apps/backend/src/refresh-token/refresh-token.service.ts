import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/database/entities/refreshToken.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async findToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token, expiryDate: MoreThan(new Date()) },
      relations: ['users'],
    });
  }

  async saveToken(
    token: string,
    userId: number,
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

  async deleteTokenForUserId(userId: number): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('userId = :userId', { userId })
      .execute();
  }
}
