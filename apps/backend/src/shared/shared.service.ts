import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";

@Injectable()
export class SharedService {
  constructor(private configService: ConfigService) {}

  getJwtKeys(): { privateKey: string; publicKey: string } {
    const privateKeyPath = this.configService.get<string>("PRIVATE_KEY_PATH");
    const publicKeyPath = this.configService.get<string>("PUBLIC_KEY_PATH");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");

    return {
      privateKey,
      publicKey,
    };
  }
}
