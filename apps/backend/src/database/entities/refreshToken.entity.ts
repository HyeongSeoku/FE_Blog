import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./user.entity";

@Entity("refresh_token")
export class RefreshToken {
  @PrimaryGeneratedColumn({ name: "token_id" })
  tokenId: number;

  @Column({ type: "varchar", length: 255 })
  token: string;

  @Column({ type: "timestamp", name: "expiry_date" })
  expiryDate: Date;

  @Column({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.userId)
  @JoinColumn({ name: "userId" })
  users: Users;
}
