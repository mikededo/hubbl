import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import Event from './Event';
import EventType from './EventType';

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
  @OneToOne(() => EventType, { cascade: true, eager: true, nullable: false })
  @JoinColumn({ name: 'event_type_fk' })
  type!: EventType;

  /**
   * `Event`'s that have been created with the current template
   */
  @OneToMany(() => Event, (e) => e.template, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  events!: Event[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
