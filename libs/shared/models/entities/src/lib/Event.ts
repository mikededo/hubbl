import { Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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
   * Name of the `Event`
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * Optional description of the `Event`
   */
  @Column('text')
  description!: string;

  /**
   * Maximum capacity of clients for this `Event`
   */
  @Column('integer', { nullable: false })
  capacity!: number;

  /**
   * Whether persons that book a place in the `Event` must have
   * the covid passport
   */
  @Column('boolean', { default: false })
  covidPassport!: boolean;

  /**
   * Whether clients must wear masks in the `Event`
   */
  @Column('boolean', { default: false })
  maskRequired!: boolean;

  /**
   * `Event`'s difficulty
   */
  @Column('integer', { default: 3 })
  @Min(1)
  @Max(5)
  difficulty!: number;

  /**
   * Time at which the `Event` starts
   */
  @Index('event-start-time-idx')
  @Column('time', { nullable: false })
  startTime!: string;

  /**
   * Time at which the `Event` ends
   */
  @Index('event-end-time-idx')
  @Column('time', { nullable: false })
  endTime!: string;

  /**
   * `Trainer` assigned to the event
   */
  @ManyToOne(() => Trainer, (t) => t.events, {
    nullable: false,
    cascade: true
  })
  trainer!: number | Trainer;

  /**
   * `Calendar` to which the `Event` belongs
   */
  @ManyToOne(() => Calendar, (c) => c.events, {
    nullable: false
  })
  calendar!: number | Calendar;

  /**
   * `EventTemplate` from which has been created
   */
  @ManyToOne(() => EventTemplate, (et) => et.events, {
    eager: true,
    onDelete: 'SET NULL'
  })
  template!: number;

  /**
   * `Appointment`'s set for the `Event`
   */
  @OneToMany(() => EventAppointment, (a) => a.event, { eager: true })
  appointments!: EventAppointment[];

  /**
   * Count of the appointments when events are fetched to see them
   * in the calendar
   */
  appointmentCount!: number;

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
