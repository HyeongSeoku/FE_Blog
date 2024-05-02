import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './posts.entity';

@Entity('tags')
export class Tags {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ unique: true })
  name: string;

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

  @ManyToMany((type) => Posts, (post) => post.tags)
  posts: Posts[];
}
