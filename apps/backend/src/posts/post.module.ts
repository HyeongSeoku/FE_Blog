import { Module } from '@nestjs/common';
import SharedModule from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, SharedModule],
})
export default class PostModule {}
