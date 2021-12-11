import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn
} from 'typeorm';

import Person from './Person';
import VirtualGym from './VirtualGym';

/**
 * `Owner` entity, as the main user of the application
 */
@Entity()
export default class Owner {
  /**
   * Personal information of the owner.
   */
  @OneToOne(() => Person, { primary: true, cascade: true, eager: true })
  @JoinColumn({ name: 'owner_person_fk' })
  person!: Person;

  /**
   * Owned `VirtualGym`'s.
   */
  @OneToMany(() => VirtualGym, (vg) => vg.owner)
  virtualGyms!: VirtualGym[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
