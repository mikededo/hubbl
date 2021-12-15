import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';

import Appointment from './Appointment';
import Person from './Person';

/**
 * `Client` will make the different `Appointment`'s to the
 * `Event`'s of the `Gym`. Their basic informatin is kept in
 * {@link Person}
 */
@Entity()
export default class Client {
  @OneToOne(() => Person, {
    primary: true,
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'client_person_fk' })
  person!: Person;

  /**
   * `Appointment`'s made by the `Client`
   */
  @OneToMany(() => Appointment, (a) => a.client)
  appointments!: Appointment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
