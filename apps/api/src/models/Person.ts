import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export default class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('person-email-idx', { unique: true })
  @Column('varchar', { nullable: false, length: 255 })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Index('person-first-name-idx', { unique: false })
  @Column('varchar', { nullable: false, length: 255 })
  firstName!: string;

  @Index('person-last-name-idx', { unique: false })
  @Column('varchar', { nullable: false, length: 255 })
  lastName!: string;

  @Column('char')
  gender!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
