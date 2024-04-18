import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: process.env.NODE_ENV !== 'production',
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'], // 마이그레이션 파일 경로
        migrationsRun: true, // 애플리케이션 시작 시 마이그레이션 자동 실행
        synchronize: false, // 엔티티와 데이터베이스 스키마 자동 동기화 비활성화
        extra: {
          ssl: process.env.NODE_ENV === 'production', // SSL 활성화 여부를 환경에 따라 결정
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
