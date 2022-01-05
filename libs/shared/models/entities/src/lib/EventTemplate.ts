import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Event from './Event';
import EventType from './EventType';
import Gym from './Gym';

@Entity()
export default class EventTemplate {
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
   * `EventType` of the `EventTemplate`
   */
  @ManyToOne(() => EventType, (ev) => ev.eventTemplates, {
    cascade: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'event_type_fk' })
  type!: number;

  /**
   * `Event`'s that have been created with the current template
   */
  @OneToMany(() => Event, (e) => e.template, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  events!: Event[];

  /**
   * `Gym` to which the `EventTemplate` belongs
   */
  @ManyToOne(() => Gym, (g) => g.eventTemplates, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  gym!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
