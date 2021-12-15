import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Person from './Person';

/**
 * Their basic information is kept in {@link Person}.
 * This model merely contains the different permissions
 * of the `Worker`.
 */
@Entity()
export default class Worker {
  @OneToOne(() => Person, {
    primary: true,
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'worker_person_fk' })
  person!: Person;

  /**
   * References to the manager of this employee.
   */
  @OneToOne(() => Person)
  @JoinColumn({ name: 'manager_id_fk' })
  managerId!: Person;

  /**
   * Unique `Worker` code which can only be changed by their
   * manager.
   */
  @Index('worker-code-idx', { unique: true })
  @Column('uuid', { nullable: false })
  @Generated('uuid')
  workerCode!: string;

  /**
   * The `Worker` is allowed or not to UPDATE `VirtualGym`
   * {@link VirtualGym}.
   */
  @Column('bool', { default: false })
  UVirtualGyms!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `GymZones`.
   */
  @Column('bool', { default: false })
  CGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `GymZones`.
   */
  @Column('bool', { default: false })
  UGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `GymZones`.
   */
  @Column('bool', { default: false })
  DGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Trainers`.
   */
  @Column('bool', { default: false })
  CTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Trainers`.
   */
  @Column('bool', { default: false })
  UTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Trainers`.
   */
  @Column('bool', { default: false })
  DTrainers!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
