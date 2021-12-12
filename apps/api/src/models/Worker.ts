import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Person from './Person';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Trainer from './Trainer';
import VirtualGym from './VirtualGym';

/**
 * `Worker` is the main user of the application. Their basic
 * information is kept in {@link Person}. This model merely contains
 * the different permissions of the `Worker`.
 */
@Entity()
export default class Worker {
  @OneToOne(() => Person, { primary: true, cascade: true, eager: true })
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

  @ManyToMany(() => VirtualGym, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinTable({
    name: 'virtual_gym_access',
    joinColumn: { name: 'person' },
    inverseJoinColumn: { name: 'virtual_gym' }
  })
  virtualGym: VirtualGym[];

  /**
   * The `Worker` is allowed or not to UPDATE `VirtualGym`
   * {@link VirtualGym}.
   */
  @Column('bool', { default: false })
  UVirtualGyms!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `GymZones`.
   * {@link GymZone}
   */
  @Column('bool', { default: false })
  CGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `GymZones`.
   * {@link GymZone}
   */
  @Column('bool', { default: false })
  UGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `GymZones`.
   * {@link GymZone}
   */
  @Column('bool', { default: false })
  DGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Trainers`.
   * {@link Trainer}
   */
  @Column('bool', { default: false })
  CTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Trainers`.
   * {@link Trainer}
   */
  @Column('bool', { default: false })
  UTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Trainers`.
   * {@link Trainer}
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
