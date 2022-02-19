import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppPalette } from '@hubbl/shared/types';

import { Gym, Trainer } from './';

@Entity()
export default class TrainerTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  @Column('enum', {
    enum: AppPalette,
    enumName: 'app_palette',
    default: AppPalette.BLUE
  })
  color!: AppPalette;

  @ManyToOne(() => Gym, (g) => g.trainerTags, { nullable: false })
  gym!: number;

  @ManyToMany(() => Trainer, (t) => t.tags)
  trainers!: Trainer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
