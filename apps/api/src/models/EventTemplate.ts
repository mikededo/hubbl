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

  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  @Column('text')
  description!: string;

  @OneToOne(() => EventType, { cascade: true, eager: true, nullable: false })
  @JoinColumn({ name: 'event_type_fk' })
  type!: EventType;

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
