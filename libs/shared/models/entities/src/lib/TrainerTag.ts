import { AppPalette } from '@hubbl/shared/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Gym } from '.';

@Entity()
export default class TrainerTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  @Column('enum', { enum: AppPalette, enumName: 'app_palette' })
  color!: AppPalette;

  @ManyToOne(() => Gym, (g) => g.trainerTags, { nullable: false })
  gym!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
