import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from 'src/database/entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tags])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
