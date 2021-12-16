import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { GymZoneIntervals } from '@gymman/shared/types';

import VirtualGym from './VirtualGym';

@Entity()
export default class GymZone {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `GymZone` name
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * `GymZone` description
   */
  @Column('text')
  description!: string;

  /**
   * If the current `GymZone` is a class type, and it can have
   * scheduled classes
   */
  @Column('bool', { default: false })
  isClassType!: boolean;

  /**
   * Maximum capacity of clients in the `GymZone`
   */
  @Column('integer', { nullable: false })
  capacity!: number;

  /**
   * Whether the mask is required or not in the `GymZone`
   */
  @Column('boolean', { nullable: false, default: true })
  maskRequired!: boolean;

  /**
   * Whether the `Client` must have had registered the covid
   * passport or not to access the `GymZone`
   */
  @Column('boolean', { nullable: false, default: true })
  covidPassport!: boolean;

  /**
   * Time at which the `GymZone` opens, and appointments can
   * be made
   */
  @Column('time', { nullable: false, default: '08:00:00' })
  openTime!: string;

  /**
   * Time at which the `GymZone` closes, and appointments
   * can be made
   */
  @Column('time', { nullable: false, default: '22:00:00' })
  closeTime!: string;

  /**
   * Defines the intervals in which the clients can make reservations
   * for a non-class `GymZone`
   */
  @Column('enum', {
    array: true,
    enum: GymZoneIntervals,
    enumName: 'time_interval',
    default: [
      GymZoneIntervals.THIRTEEN,
      GymZoneIntervals.HOUR,
      GymZoneIntervals.HOURTHIRTY,
      GymZoneIntervals.HOURS
    ]
  })
  timeIntervals: GymZoneIntervals[];

  /**
   * `VirtualGym` to which the `GymZone` belongs
   */
  @ManyToOne(() => VirtualGym, (vg) => vg.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  virtualGym!: VirtualGym;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
