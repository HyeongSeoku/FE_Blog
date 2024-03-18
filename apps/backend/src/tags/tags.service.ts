import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from 'src/database/entities/tags.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './tags.dto';
import { SuccessResponse } from 'src/shared/response';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}
  private readonly logger = new Logger(TagsService.name);

  async getAllTags() {
    const list = await this.tagsRepository.find();
    return { list, total: list.length };
  }

  async createTag(createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    const existTag = await this.tagsRepository.findOne({
      where: { name },
    });

    if (existTag)
      throw new ConflictException(
        `A tag with the name '${name}' already exists.`,
      );

    const newTag = this.tagsRepository.create({ name });

    await this.tagsRepository.save(newTag);

    return newTag;
  }

  async updateTag(@Param('tagId') tagId: number, createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    const targetTag = await this.tagsRepository.findOne({ where: { tagId } });

    if (!targetTag)
      throw new NotFoundException(`Tag with ID ${tagId} not found.`);

    if (!name) throw new BadRequestException('Name field is required.');

    if (name === targetTag.name)
      throw new BadRequestException(
        'The new name must be different from the current name.',
      );

    if (name) {
      targetTag.name = name;
    }

    return targetTag;
  }

  async deleteTag(tagId: number) {
    this.logger.log('TEST', tagId);
    const targetTag = await this.tagsRepository.findOne({ where: { tagId } });

    if (!targetTag)
      throw new NotFoundException(`Tag with ID ${tagId} not found.`);

    await this.tagsRepository.delete(tagId);

    const response = new SuccessResponse({ message: 'Delete complete' });
    return response;
  }
}
