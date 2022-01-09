import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';

import Appointment from './Appointment';
import Client from './Client';
import Event from './Event';

@Entity()
export default class EventAppointment extends Appointment {
  /**
   * `Client` that is linked to the `Appointment`
   */
  @ManyToOne(() => Client, (c) => c.eventAppointments, {
    nullable: false,
    cascade: true
  })
  client!: number;

  /**
   * `Event` that is linked to the `Appointment`
   */
  @ManyToOne(() => Event, (e) => e.appointments, {
    nullable: false,
    cascade: true
  })
  event!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
