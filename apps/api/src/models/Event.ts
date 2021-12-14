import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { CalendarDate } from './';
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
   * `EventTemplate` from which has been created
   */
  @ManyToOne(() => EventTemplate, (et) => et.events, {
    nullable: false,
    eager: true
  })
  template!: EventTemplate;

  /**
   * `CalendarDate` of the event
   */
  @OneToMany(() => CalendarDate, (d) => d.events, {
    eager: true,
    cascade: true
  })
  date!: CalendarDate;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
