import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Defines the `Appointment` made by a `Client` for a spcecific
 * `Event`
 */
@Entity()
export default class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Time at which the `Appointment` starts
   */
  @Column('time', { nullable: false })
  startTime!: string;

  /**
   * Time at which the `Appointment` ends
   */
  @Column('time', { nullable: false })
  endTime!: string;

  /**
   * If the client has cancelled the `Appointment`
   */
  @Column('bool', { default: false })
  cancelled!: boolean;
}
