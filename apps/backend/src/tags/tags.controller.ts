import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { AdminGuard } from 'src/guards/admin-auth.guard';
import { CreateTagDto } from './tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Get(':tagId')
  getTag(@Param('tagId') tagId: number) {
    return this.getTag(tagId);
  }

  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @UseGuards(AdminGuard)
  @Patch('update/:tagId')
  updateTag(@Param('tagId') tagId: number, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.updateTag(tagId, createTagDto);
  }
}
