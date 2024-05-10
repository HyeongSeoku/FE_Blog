import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "src/database/entities/refreshToken.entity";
import { RefreshTokenService } from "./refresh-token.service";
import SharedModule from "src/shared/shared.module";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), SharedModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
