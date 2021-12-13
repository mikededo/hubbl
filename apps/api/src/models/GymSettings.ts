import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppTheme, ThemeColor } from '@gymman/shared/types';

@Entity()
export default class GymSettings {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Name of the overall gym, displayed in the settings menu
   */
  @Column('varchar', { length: 255, nullable: false })
  name!: string;

  /**
   * Contact email of the gym, which differs from the user
   */
  @Column('varchar', { length: 255, nullable: false })
  email!: string;

  /**
   * Optionall contact phone of the gym
   */
  @Column('varchar', { length: 45 })
  phone!: string;

  /**
   * Chosen theme of the app by the `Owner`
   */
  @Column('enum', { enum: AppTheme, default: AppTheme.LIGHT })
  theme!: AppTheme;

  /**
   * Primary color of the theme chosen by the `Owner`
   */
  @Column('enum', { enum: ThemeColor, default: ThemeColor.BLUE })
  color!: ThemeColor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
