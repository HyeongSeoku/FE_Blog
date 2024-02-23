import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Categories } from './categories';

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

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'fk_user_id' })
  user: Users;

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'fk_category_id' })
  category: Categories;
}
