import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Calendar from './Calendar';
import CalendarDate from './CalendarDate';
import EventAppointment from './EventAppointment';
import EventTemplate from './EventTemplate';
import Trainer from './Trainer';

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `Trainer` assigned to the event
   */
  @ManyToOne(() => Trainer, (t) => t.events, {
    nullable: false,
    lazy: true,
    cascade: true
  })
  trainer!: Trainer;

  /**
   * `Calendar` to which the `Event` belongs
   */
  @ManyToOne(() => Calendar, (c) => c.events, {
    nullable: false
  })
  calendar!: Calendar;

  /**
   * `EventTemplate` from which has been created
   */
  @ManyToOne(() => EventTemplate, (et) => et.events, {
    nullable: false,
    eager: true
  })
  template!: EventTemplate;

  /**
   * `Appointment`'s set for the `Event`
   */
  @OneToMany(() => EventAppointment, (a) => a.event)
  appointments!: EventAppointment[];

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
