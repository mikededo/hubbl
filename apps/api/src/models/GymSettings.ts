import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('enum', { enum: AppTheme, default: AppTheme.LIGHT })
  theme!: AppTheme;

  @Column('enum', { enum: ThemeColor, default: ThemeColor.BLUE })
  color!: ThemeColor;
}
