import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

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

  @Column({ type: 'tinyint', name: 'is_admin' })
  is_admin: number;

  @AfterLoad()
  setIsAdmin() {
    this.isAdmin = this.is_admin === 1;
  }

  isAdmin: boolean;

  public toSafeObject() {
    const { is_admin, password, userId, ...safeData } = this;
    return safeData;
  }
}
