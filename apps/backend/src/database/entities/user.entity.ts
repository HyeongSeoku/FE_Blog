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
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
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

  // 팔로워 관계
  @OneToMany(() => Followers, (follower) => follower.followee)
  followers: Followers[];

  // 팔로잉 관계
  @OneToMany(() => Followers, (follower) => follower.follower)
  following: Followers[];

  public toSafeObject() {
    const { password, userId, ...safeData } = this;
    return safeData;
  }

  public userDefaultInfoResponse(showRole: boolean) {
    const {
      password,
      userId,
      createdAt,
      updatedAt,
      isAdmin,
      ...userInfoResponse
    } = this;

    const response = showRole
      ? { ...userInfoResponse, isAdmin }
      : userInfoResponse;

    return response;
  }
}
