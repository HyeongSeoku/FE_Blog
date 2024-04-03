import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './posts.entity';

@Entity('views')
export class Views {
  @PrimaryGeneratedColumn({ name: 'view_id' })
  viewId: number;

  @Column({ name: 'view_count' })
  viewCount: number;

  @ManyToOne(() => Posts, (post) => post.views)
  posts: Posts;

  @Column({ name: 'post_id' })
  postId: string;
}
