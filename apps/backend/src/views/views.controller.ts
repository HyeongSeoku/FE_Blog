import { Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}

  private logger = new Logger(ViewsController.name);

  @Patch('update/:postId')
  async updatePostView(@Param('postId') postId: string) {
    return this.viewsService.updatePostViewCount(postId);
  }
}
