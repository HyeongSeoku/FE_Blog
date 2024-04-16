import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, ConfigModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('TypeOrmModule should be configured with the correct parameters', async () => {
    const configService = module.get<ConfigService>(ConfigService);
    const typeOrmOptions = await module.get('TypeOrmModuleOptions');

    expect(typeOrmOptions).toBeDefined();
    expect(typeOrmOptions.type).toEqual('mysql');
    expect(typeOrmOptions.host).toEqual(configService.get('DB_HOST'));
    expect(typeOrmOptions.port).toEqual(+configService.get('DB_PORT'));
    expect(typeOrmOptions.username).toEqual(configService.get('DB_USERNAME'));
    expect(typeOrmOptions.password).toEqual(configService.get('DB_PASSWORD'));
    expect(typeOrmOptions.database).toEqual(configService.get('DB_DATABASE'));
    expect(typeOrmOptions.entities).toContain(
      __dirname + '/**/*.entity{.ts,.js}',
    );
    expect(typeOrmOptions.logging).toEqual(
      process.env.NODE_ENV !== 'production',
    );
    expect(typeOrmOptions.extra.ssl).toEqual(
      process.env.NODE_ENV === 'production',
    );
  });

  afterEach(async () => {
    await module.close();
  });
});
