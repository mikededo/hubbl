import { Max, Min } from 'class-validator';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import Event from './Event';

/**
 * Entity that defines a date of the calendar. Its unique primary key
 * is composed by the year, month and day
 */
@Entity()
@Index(['year', 'month', 'day'], { unique: true })
export default class CalendarDate {
  /**
   * Year of the `CalendarDate`
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  year!: number;

  /**
   * Month of the `CalendarDate`
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  @Min(1)
  @Max(12)
  month!: number;

  /**
   * Day of the `CalendarDate`
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  @Min(1)
  @Max(31)
  day!: number;

  /**
   * `Event`'s of the `CalendarDate`
   */
  @ManyToOne(() => Event, (e) => e.date)
  events!: Event[];
}
