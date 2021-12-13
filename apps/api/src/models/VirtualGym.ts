import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import GymZone from './GymZone';
import Person from './Person';

/**
 * Entity that defines the gym. It contains all the different
 * constraints which can be modified constantly
 */
@Entity()
export default class VirtualGym {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `VirtualGym` description
   */
  @Column('varchar', { nullable: false, length: 255 })
  name!: string;

  /**
   * `VirtualGym` description
   */
  @Column('text')
  description!: string;

  /**
   * Owner of the `VirtualGym`. Only the owner has access to create
   * and delete `VirtualGym`
   */
  @ManyToOne(() => Person, (person) => person.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  owner!: number;

  /**
   * `GymZones` of the `VirtualGym`
   */
  @OneToMany(() => GymZone, (gz) => gz.virtualGym, {
    cascade: true,
    eager: true
  })
  gymZones!: GymZone[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
