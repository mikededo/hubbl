import { Max, Min } from 'class-validator';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

/**
 * Entity that defines a date of the calendar. Its unique primary key
 * is composed by the year, month and day
 */
@Entity()
@Index(['year', 'month', 'day'], { unique: true })
export default class CalendarDate {
  /**
   * Year of the date
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  year!: number;

  /**
   * Month of the date
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  @Min(1)
  @Max(12)
  month!: number;

  /**
   * Day of the date
   */
  @Column('smallint', { nullable: false })
  @PrimaryColumn()
  @Min(1)
  @Max(31)
  day!: number;
}
