import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255 })
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

  @Column({ type: 'tinyint', name: 'is_admin' })
  private is_admin: number;

  get isAdmin(): boolean {
    return this.is_admin === 1;
  }
}
