import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ThemeColor } from '@gymman/shared/types';

import EventType from './EventType';
import Person from './Person';
import VirtualGym from './VirtualGym';

@Entity()
export default class Gym {
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
   * `EventType`'s that belong to the gym, and will be common
   * to all workers
   */
  @OneToMany(() => EventType, (et) => et.gym, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  eventTypes!: EventType[];

  /**
   * Relation that allows us to know what users 
   */
  @OneToMany(() => Person, p => p.gym)
  persons!: Person[];

  /**
   * `VirtualGym`'s of the `Gym`
   */
  @OneToMany(() => VirtualGym, vg => vg.gym, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  virtualGyms!: VirtualGym[];

  /**
   * Primary color of the theme chosen by the `Owner`
   */
  @Column('enum', { enum: ThemeColor, enumName: 'theme_color', default: ThemeColor.BLUE })
  color!: ThemeColor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
