import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Gym from './Gym';
import Person from './Person';

/**
 * `Owner` entity, as the main user of the application
 */
@Entity()
export default class Owner {
  /**
   * Personal information of the owner
   */
  @OneToOne(() => Person, {
    primary: true,
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'owner_person_fk' })
  person!: Person;

  /**
   * `Gym` owned by the `Owner`
   */
  @OneToOne(() => Gym, { cascade: true, eager: true })
  @JoinColumn()
  gym!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
