import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn()
  categoryId: Number;

  @Column()
  name: String;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
