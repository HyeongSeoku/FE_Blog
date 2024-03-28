import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Categories } from './categories.entity';
import { Tags } from './tags.entity';
import { Comments } from './comments.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column()
  title: string;

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

  @ManyToOne(() => Categories, (category) => category.categoryId)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @ManyToMany((type) => Tags, (tag) => tag.posts)
  @JoinTable({
    name: 'posts_tags', // 중간 테이블의 이름
    joinColumn: { name: 'post_id', referencedColumnName: 'postId' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tagId' },
  })
  tags: Tags[];

  @OneToMany(() => Comments, (comment) => comment.post, {
    cascade: true, // 포스트를 저장할 때 코멘트도 같이 저장하고 싶다면
    eager: false, // 자동으로 코멘트를 로드하고 싶지 않다면 false로 설정
  })
  comments: Comments[];
}
