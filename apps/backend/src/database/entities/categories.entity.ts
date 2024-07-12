import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export class Categories {
  @PrimaryGeneratedColumn({ name: "category_id" })
  categoryId: number;

  @Column({ unique: true })
  name: string;

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

  @Column({ unique: true, name: "category_key" })
  categoryKey: string;
}
