import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./posts.entity";

@Entity("views")
export class Views {
  @PrimaryGeneratedColumn({ name: "view_id" })
  viewId: number;

  @Column({ name: "view_count", default: 0 })
  viewCount: number;

  @OneToOne(() => Posts, (post) => post.views)
  @JoinColumn({ name: "post_id" }) // 이 부분을 추가합니다.
  posts: Posts;

  @Column({ name: "post_id" })
  postId: string;
}
