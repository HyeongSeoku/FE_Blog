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
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  title: String;

  @Column()
  body: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.userId)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Categories, (category) => category.categoryId)
  @JoinColumn({ name: 'category_id' })
  category: Categories;
}
