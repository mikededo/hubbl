import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import EventTemplate from './EventTemplate';
import Trainer from './Trainer';

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Trainer, (t) => t.events, { cascade: true, lazy: true })
  trainer!: Trainer;

  @ManyToOne(() => EventTemplate, (et) => et.events, {
    nullable: false,
    eager: true
  })
  template!: EventTemplate;
}
