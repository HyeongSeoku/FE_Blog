import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';
import { Users } from './user.entity';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  content: string;

  @ManyToOne(() => Posts)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @Column({ type: 'tinyint', name: 'is_deleted' })
  is_deleted: number;

  @AfterLoad()
  setIsDeleted() {
    this.isDeleted = this.is_deleted === 1;
  }

  isDeleted: boolean;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Comments, (comments) => comments.parent)
  replies: Comments[];

  @ManyToOne(() => Comments, (comments) => comments.replies)
  @JoinColumn({ name: 'parent_comment_id' })
  parent: Comments;
}
