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

import { AppTheme, Gender } from '@hubbl/shared/types';

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
  @Column('varchar', { nullable: false, length: 255 })
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
   * `Person`'s phone
   */
  @Column('varchar', { length: 45, nullable: true })
  phone!: string;

  /**
   * `Gym` to which the `Person` belongs
   */
  @ManyToOne(() => Gym, (g) => g.persons, { cascade: true, eager: true })
  gym!: Gym | number;

  /**
   * Chosen theme of the app by the `Owner`
   */
  @Column('enum', {
    enum: AppTheme,
    enumName: 'app_theme',
    default: AppTheme.LIGHT
  })
  theme!: AppTheme;

  /**
   * `Person`'s gender
   */
  @Column('enum', { enum: Gender, enumName: 'gender', nullable: false })
  gender!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
