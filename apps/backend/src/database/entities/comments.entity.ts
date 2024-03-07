import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  commentId: Number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  body: string;

  @ManyToOne(() => Posts)
  @JoinColumn({ name: 'post_id' })
  posts: Posts;
}
