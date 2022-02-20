import { Max, Min } from 'class-validator';
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
   * Name of the `Event`. This field will not be copied to the 
   * `Event`
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * Optional description of the `Event`. This field will not be
   * copied tot the `Event`.
   */
  @Column('text')
  description!: string;

  /**
   * Capacity of the `EventTemplate`'s which will be copied
   * to the template
   */
  @Column('integer', { nullable: false })
  capacity!: number;

  /**
   * Whether the covid passport is required in the `EventTemplate`
   */
  @Column('boolean', { default: false })
  covidPassport!: boolean;

  /**
   * Whether the mask is required is required in the `EventTemplate`
   */
  @Column('boolean', { default: false })
  maskRequired!: boolean;

  /**
   * The difficulty of the `EventTemplate`
   */
  @Column('integer', { default: 3 })
  @Min(1)
  @Max(5)
  difficulty!: number;

  /**
   * `EventType` of the `EventTemplate`
   */
  @ManyToOne(() => EventType, (ev) => ev.eventTemplates, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'event_type_fk' })
  type!: number | EventType;

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
