import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as fs from 'fs';
import { SharedService } from './shared.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(ConfigModule.name);

        return {
          secret: fs.readFileSync(
            configService.get('PRIVATE_KEY_PATH'),
            'utf8',
          ),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],
  providers: [SharedService],
  exports: [JwtModule, PassportModule, SharedService],
})
export default class SharedModule {}
