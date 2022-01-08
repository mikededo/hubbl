import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';

import Appointment from './Appointment';
import Calendar from './Calendar';
import CalendarDate from './CalendarDate';
import Client from './Client';

@Entity()
export default class CalendarAppointment extends Appointment {
  /**
   * `Client` that is linked to the `Appointment`
   */
  @ManyToOne(() => Client, (c) => c.calendarAppointments, {
    primary: true,
    nullable: false,
    cascade: true
  })
  client!: number;

  /**
   * `Event` that is linked to the `Appointment`
   */
  @ManyToOne(() => Calendar, (e) => e.appointments, {
    primary: true,
    nullable: false,
    cascade: true
  })
  calendar!: number;

  /**
   * `CalendarDate` of the event
   */
  @ManyToOne(() => CalendarDate, (d) => d.events, {
    eager: true,
    cascade: true,
    nullable: false
  })
  date!: CalendarDate;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
