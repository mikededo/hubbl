import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppPalette } from '@gymman/shared/types';

@Entity()
export default class EventType {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Name of the selected event
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * Small description of the selected event
   */
  @Column('text')
  description!: string;

  /**
   * Color of the event type label
   */
  @Column('enum', { enum: AppPalette, default: AppPalette.BLUE })
  labelColor!: AppPalette;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
