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
    primary: true,
    nullable: false,
    cascade: true
  })
  client!: Client;

  /**
   * `Event` that is linked to the `Appointment`
   */
  @ManyToOne(() => Event, (e) => e.appointments, {
    primary: true,
    nullable: false,
    cascade: true
  })
  event!: Event;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
