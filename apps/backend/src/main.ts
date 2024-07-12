import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { AllExceptionsFilter } from "./exception";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const FE_BASE_URL = configService.get("FE_BASE_URL");

  app.useStaticAssets(join(__dirname, "..", "uploads"));

  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: FE_BASE_URL,
    credentials: true,
    exposedHeaders: "Set-Cookie",
  });

  await app.listen(3000);
}
bootstrap();
