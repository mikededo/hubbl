import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';

import Client from './Client';
import Event from './Event';

/**
 * Defines the `Appointment` made by a `Client` for a spcecific
 * `Event`
 */
@Entity()
@Index(['event', 'client'], { unique: true })
export default class Appointment {
  /**
   * `Event` that is linked to the `Appointment`
   */
  @ManyToOne(() => Event, (e) => e.appointments, {
    primary: true,
    nullable: false,
    cascade: true
  })
  event!: Event;

  /**
   * `Client` that is linked to the `Appointment`
   */
  @ManyToOne(() => Client, (c) => c.appointments, {
    primary: true,
    nullable: false,
    cascade: true
  })
  client!: Client;

  /**
   * Time at which the `Appointment` starts
   */
  @Column('time', { nullable: false })
  startTime!: string;

  /**
   * Time at which the `Appointment` ends
   */
  @Column('time', { nullable: false })
  endTime!: string;

  /**
   * If the client has cancelled the `Appointment`
   */
  @Column('bool', {default: false})
  cancelled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
