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

import Gym from './Gym';
import GymZone from './GymZone';

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

  @ManyToOne(() => Gym, gym => gym.virtualGyms)
  gym!: Gym;

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
