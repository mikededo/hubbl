import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import Event from './Event';
import GymZone from './GymZone';

/**
 * `Calendar` of `Event`'s for a `GymZone`
 */
@Entity()
export default class Calendar {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `GymZone` to which this `Calendar` belongs
   */
  @OneToOne(() => GymZone)
  @JoinColumn()
  gymZone!: GymZone;

  /**
   * `Event`'s of the `Calendar`-
   */
  @OneToMany(() => Event, (e) => e.calendar, {
    lazy: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  events!: Event[];
}
