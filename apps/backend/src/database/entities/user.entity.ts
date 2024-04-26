import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Followers } from './followers.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @Column({
    type: 'tinyint',
    name: 'is_admin',
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
  })
  isAdmin: boolean;

  @Column({ name: 'github_id', length: 255 })
  githubId: string;

  @Column({ name: 'github_img_url', length: 255 })
  githubImgUrl: string;

  // 팔로워 관계
  @OneToMany(() => Followers, (follower) => follower.follower)
  followers: Followers[];

  // 팔로잉 관계
  @OneToMany(() => Followers, (follower) => follower.following)
  following: Followers[];
}
