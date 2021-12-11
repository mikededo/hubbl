import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Person from './Person';

/**
 * `Trainer` is an entity that defines a worker with no access
 * to the application but it is linked to the 
 */
@Entity()
export default class Trainer {
  @OneToOne(() => Person, { primary: true, cascade: true, eager: true })
  @JoinColumn({ name: 'trainer_person_fk' })
  person!: Person;

  /**
   * References to the manager of this employee
   */
  @OneToOne(() => Person)
  @JoinColumn({ name: 'manager_id_fk' })
  managerId!: number;

  /**
   * Unique `Trainer` code which can only be changed by their
   * manager
   */
  @Index('trainer-code-idx', { unique: true })
  @Column('uuid', { nullable: false, default: 'uuid_generate_v4()' })
  workerCode!: string;



  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
