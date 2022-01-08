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
  @OneToOne(() => Person, { nullable: false })
  @JoinColumn({ name: 'manager_id_fk' })
  managerId!: number;

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
  updateVirtualGyms!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `GymZone`'s.
   */
  @Column('bool', { default: false })
  createGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `GymZone`'s.
   */
  @Column('bool', { default: false })
  updateGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `GymZone`'s.
   */
  @Column('bool', { default: false })
  deleteGymZones!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Trainer`'s.
   */
  @Column('bool', { default: false })
  createTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Trainer`'s.
   */
  @Column('bool', { default: false })
  updateTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Trainer`'s.
   */
  @Column('bool', { default: false })
  deleteTrainers!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Client`'s.
   */
  @Column('bool', { default: false })
  createClients!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Client`'s.
   */
  @Column('bool', { default: false })
  updateClients!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Client`'s.
   */
  @Column('bool', { default: false })
  deleteClients!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `Event`'s.
   */
  @Column('bool', { default: false })
  createEvents!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `Event`'s.
   */
  @Column('bool', { default: false })
  updateEvents!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `Event`'s.
   */
  @Column('bool', { default: false })
  deleteEvents!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventType`'s.
   */
  @Column('bool', { default: false })
  createEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventType`'s.
   */
  @Column('bool', { default: false })
  updateEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventType`'s.
   */
  @Column('bool', { default: false })
  deleteEventTypes!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  createEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  updateEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventTemplates`'s.
   */
  @Column('bool', { default: false })
  deleteEventTemplates!: boolean;

  /**
   * The `Worker` is allowed or not to CREATE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  createEventAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to UPDATE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  updateEventAppointments!: boolean;

  /**
   * The `Worker` is allowed or not to DELETE `EventAppointment`'s.
   */
  @Column('bool', { default: false })
  deleteEventAppointments!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
