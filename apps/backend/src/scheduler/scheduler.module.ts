import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { RefreshTokenModule } from "src/refresh-token/refresh-token.module";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot(), RefreshTokenModule],
  providers: [SchedulerService, RefreshTokenService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
