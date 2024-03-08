import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import * as csurf from 'csurf';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CsrfTokenInterceptor } from './interceptors/csrf-token.interceptor';
import PostModule from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RefreshTokenModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: CsrfTokenInterceptor },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(csurf({ cookie: { key: 'XSRF-TOKEN', httpOnly: true } }))
//       .exclude({ path: 'auth/login', method: RequestMethod.POST })
//       // .exclude({ path: 'posts/create', method: RequestMethod.POST })
//       .forRoutes({ path: '*', method: RequestMethod.ALL }); // CHECK: 특정 경로에만 적용할지 추후 결정
//   }
// }
