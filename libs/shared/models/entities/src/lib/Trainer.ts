import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import Event from './Event';
import Person from './Person';
import TrainerTag from './TrainerTag';

/**
 * `Trainer` is an entity that defines a worker with no access
 * to the application but it is linked to the classes and
 * non-class `VirtualGym`'s
 */
@Entity()
export default class Trainer {
  /**
   * Primary column of the `Person` relationship
   */
  @PrimaryColumn()
  personId!: number;

  @OneToOne(() => Person, {
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn()
  person!: Person;

  /**
   * `Event`'s of the `Trainer`
   */
  @OneToMany(() => Event, (e) => e.trainer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  events!: Event[];

  /**
   * `Tag`'s of the `Trainer`
   */
  @ManyToMany(() => TrainerTag, (tt) => tt.trainers, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({ name: 'trainer_tags' })
  tags!: TrainerTag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
