import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Views } from "src/database/entities/views.entity";
import { PostsService } from "src/posts/posts.service";
import { Repository } from "typeorm";

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(Views)
    private viewsRepository: Repository<Views>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}

  private logger = new Logger(ViewsService.name);

  async findViewsByPostId(postId: string) {
    const targetView = await this.viewsRepository.findOne({
      where: { postId },
      relations: ["posts"],
    });
    if (!targetView) throw new NotFoundException(`${postId} views not exist`);

    return targetView;
  }

  async updatePostViewCount(postId: string) {
    await this.postsService.findOnePost(postId);

    await this.viewsRepository
      .createQueryBuilder()
      .update(Views)
      .set({
        viewCount: () => "view_count + 1 ",
      })
      .where("postId= :postId", { postId })
      .execute();

    const updatedViews = await this.viewsRepository.findOne({
      where: { postId },
    });

    return updatedViews;
  }

  async createPostView(postId: string) {
    if (!postId) throw new BadRequestException("postId is required");

    const targetView = await this.viewsRepository.findOne({
      where: { postId },
    });

    if (targetView) throw new ConflictException(`${postId} views is exist`);

    const newView = this.viewsRepository.create({ postId, viewCount: 0 });
    await this.viewsRepository.save(newView);

    return newView;
  }

  async deletePostView(postId: string) {
    if (!postId) throw new BadRequestException("postId is required");

    const targetView = await this.findViewsByPostId(postId);

    await this.viewsRepository.delete({
      postId: targetView.postId,
      viewId: targetView.viewId,
    });
  }
}
