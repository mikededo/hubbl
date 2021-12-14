import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppTheme } from '@gymman/shared/types';

import Gym from './Gym';

@Entity()
export default class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * `Person`'s email
   */
  @Index('person-email-idx', { unique: true })
  @Column('varchar', { nullable: false, length: 255 })
  email!: string;

  /**
   * `Person`'s password which should be encrypted
   */
  @Column({ nullable: false })
  password!: string;

  /**
   * `Person`'s first name indexed for faster searches
   */
  @Index('person-first-name-idx', { unique: false })
  @Column('varchar', { nullable: false, length: 255 })
  firstName!: string;

  /**
   * `Person`'s last name indexed for faster searches
   */
  @Index('person-last-name-idx', { unique: false })
  @Column('varchar', { nullable: false, length: 255 })
  lastName!: string;

  /**
   * `Gym` to which the `Person` belongs. `Owner`'s will have this
   * prop as null
   */
  @ManyToOne(() => Gym, (g) => g.persons, { cascade: true, eager: true })
  gym!: Gym;

  /**
   * Chosen theme of the app by the `Owner`
   */
  @Column('enum', { enum: AppTheme, default: AppTheme.LIGHT })
  theme!: AppTheme;

  // TODO: update to enum
  /**
   * `Person`'s gender
   */
  @Column('char')
  gender!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
