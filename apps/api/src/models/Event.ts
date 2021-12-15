import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Appointment from './Appointment';

import Calendar from './Calendar';
import CalendarDate from './CalendarDate';
import EventTemplate from './EventTemplate';
import Trainer from './Trainer';

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `Trainer` assigned to the event
   */
  @OneToMany(() => Trainer, (t) => t.events, { cascade: true, lazy: true })
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
  @OneToMany(() => Appointment, (a) => a.event)
  appointments!: Appointment[];

  /**
   * `CalendarDate` of the event
   */
  @OneToMany(() => CalendarDate, (d) => d.events, {
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
