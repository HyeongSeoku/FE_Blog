import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { Upload } from "src/database/entities/upload.entity";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { Repository } from "typeorm";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log("Running the scheduled task to clean up expired tokens.");
    await this.refreshTokenService.deleteExpiredTokens();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldFiles() {
    const uploadDir = join(__dirname, "..", "..", "uploads", "temp");
    const files = await readdir(uploadDir);

    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24시간

    for (const file of files) {
      const filePath = join(uploadDir, file);
      const { birthtime } = await stat(filePath);

      if (now - birthtime.getTime() > expirationTime) {
        await unlink(filePath);
        await this.uploadRepository.delete({ path: `uploads/temp/${file}` });
        this.logger.log(`Deleted old file: ${file}`);
      }
    }
  }
}
