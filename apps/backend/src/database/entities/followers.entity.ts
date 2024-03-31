import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';

@Entity('followers')
export class Followers {
  @Column('varchar', { name: 'follower_id', primary: true, length: 36 })
  followerId: string;

  @Column('varchar', { name: 'following_id', primary: true, length: 36 })
  followingId: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // TypeORM의 데코레이터를 사용하여 users 테이블과의 관계를 정의할 수 있습니다.
  @ManyToOne(() => Users, (users) => users.following)
  @JoinColumn({ name: 'following_id' })
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followers)
  @JoinColumn({ name: 'follower_id' })
  following: Users;
}
