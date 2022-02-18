import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Event from './Event';
import Owner from './Owner';
import Person from './Person';

/**
 * `Trainer` is an entity that defines a worker with no access
 * to the application but it is linked to the classes and
 * non-class `VirtualGym`'s
 */
@Entity()
export default class Trainer {
  @OneToOne(() => Person, {
    primary: true,
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'trainer_person_fk' })
  person!: Person;

  /**
   * References to the manager of this employee
   */
  @ManyToOne(() => Owner, (o) => o.workers, { nullable: false })
  @JoinColumn({ name: 'manager_id_fk' })
  managerId!: number;

  /**
   * Unique `Trainer` code which can only be changed by their
   * manager
   */
  @Index('trainer-code-idx', { unique: true })
  @Column('uuid', { nullable: false })
  @Generated('uuid')
  workerCode!: string;

  /**
   * `Event`'s of the `Trainer`
   */
  @OneToMany(() => Event, (e) => e.trainer, {
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
