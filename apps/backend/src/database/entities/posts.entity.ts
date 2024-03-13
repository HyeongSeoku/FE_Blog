import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Categories } from './categories.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column()
  title: String;

  @Column()
  body: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.userId)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Categories, (category) => category.categoryId)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @Column({ name: 'category_id' })
  categoryId: number;
}
