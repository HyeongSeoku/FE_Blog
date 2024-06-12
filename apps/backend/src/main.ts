import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { AllExceptionsFilter } from "./exception";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const FE_BASE_URL = configService.get("FE_BASE_URL");

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
