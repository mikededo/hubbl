import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

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
   * Owner of the virtual gym. Only the owner has access to create
   * and delete virtual gyms
   */
  @ManyToOne(() => Person, (person) => person.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  owner!: number;



  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
