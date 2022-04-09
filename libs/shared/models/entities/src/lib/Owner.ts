import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

import Gym from './Gym';
import Person from './Person';
import Worker from './Worker';

/**
 * `Owner` entity, as the main user of the application
 */
@Entity()
export default class Owner {
  /**
   * Primary column of the `Person` relationship
   */
  @PrimaryColumn()
  personId!: number;

  /**
   * Personal information of the owner
   */
  @OneToOne(() => Person, {
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn()
  person!: Person;

  /**
   * `Gym` owned by the `Owner`
   */
  @OneToOne(() => Gym)
  @JoinColumn({ name: 'owner_id' })
  gym!: number;

  /**
   * `Worker`'s that work for the current `Owner`
   */
  @OneToMany(() => Worker, (w) => w.managerId, {
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  workers!: Worker[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
