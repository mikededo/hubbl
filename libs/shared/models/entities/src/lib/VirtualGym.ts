import { Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Gym from './Gym';
import GymZone from './GymZone';

/**
 * Entity that defines the gym. It contains all the different
 * constraints which can be modified constantly
 */
@Entity()
export default class VirtualGym {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `VirtualGym` description
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * `VirtualGym` description
   */
  @Column('text')
  description!: string;

  /**
   * `VirtualGym` location
   */
  @Column('varchar', { nullable: false, length: 255 })
  location!: string;

  /**
   * Maximum capacity of the `VirtualGym`
   */
  @Column('integer', { nullable: false })
  @Min(0)
  capacity!: number;

  /**
   * Optional contact phone of the gym
   */
  @Column('varchar', { length: 45, default: null })
  phone!: string;

  /**
   * Time at which the `VirtualGym` opens
   */
  @Column('time', { nullable: false })
  openTime!: string;

  /**
   * Time at which the `VirtualGym` closes
   */
  @Column('time', { nullable: false })
  closeTime!: string;

  /**
   * `Gym` to which the `VirtualGym` belongs
   */
  @ManyToOne(() => Gym, (gym) => gym.virtualGyms, { nullable: false })
  gym!: number;

  /**
   * `GymZones` of the `VirtualGym`
   */
  @OneToMany(() => GymZone, (gz) => gz.virtualGym, {
    cascade: true,
    eager: true
  })
  gymZones!: GymZone[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
