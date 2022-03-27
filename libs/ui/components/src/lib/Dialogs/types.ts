import { AppPalette } from '@hubbl/shared/types';

export type VirtualGymFormFields = {
  /**
   * Name of the `VirtualGym`
   */
  name: string;

  /**
   * Description of the `VirtualGym`
   */
  description: string;

  /**
   * Location of the `VirtualGym`
   */
  location: string;

  /**
   * Phone of the `VirtualGym`
   */
  phone: string;

  /**
   * Maximum capacity of the `VirtualGym`
   */
  capacity: number;

  /**
   * Open time of the `VirtualGym`
   */
  openTime: string;

  /**
   * Close time of the `VirtualGym`
   */
  closeTime: string;
};

export type GymZoneFormFields = {
  /**
   * Name of the `GymZone`
   */
  name: string;

  /**
   * Description of the `GymZone`
   */
  description: string;

  /**
   * Whether `GymZone` is class type or not
   */
  isClassType: boolean;

  /**
   * Whether the mask is required in the `GymZone`
   */
  maskRequired: boolean;

  /**
   * Whether the covid passport is required in `GymZone`
   */
  covidPassport: boolean;

  /**
   * Maximum capacity of the `GymZone`
   */
  capacity: number;

  /**
   * Open time of the `GymZone`
   */
  openTime: string;

  /**
   * Close time of the `GymZone`
   */
  closeTime: string;

  /**
   * Id of the `VirtualGym` to which the `GymZone` belongs
   */
  virtualGym: number | string;
};

export type EventTypeFormFields = {
  /**
   * Name of the event type
   */
  name: string;

  /**
   * Description of the event type
   */
  description: string;

  /**
   * Color of the event type
   */
  color: AppPalette;
};
