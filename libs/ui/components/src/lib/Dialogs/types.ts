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

export type EventTemplateFormFields = {
  /**
   * Name of the `EventTemplate`
   */
  name: string;

  /**
   * Description of the `EventTemplate`
   */
  description: string;

  /**
   * Capacity of the `EventTemplate`
   */
  capacity: number;

  /**
   * Whether the mask is required in the `EventTemplate`
   */
  maskRequired: boolean;

  /**
   * Whether the covid passport is required in the `EventTemplate`
   */
  covidPassport: boolean;

  /**
   * Difficulty of the `EventTemplate`
   */
  difficulty: number;

  /**
   * Event type of the `EventTemplate`
   */
  eventType: number | string;
};

export type CalendarEventFormFields = {
  /**
   * Name of the `CalendarEvent`
   */
  name: string;

  /**
   * Description of the `CalendarEvent`
   */
  description: string;

  /**
   * Gym zone of the `CalendarEvent`
   */
  gymZone: number | string;

  /**
   * Trainer of the `CalendarEvent`
   */
  trainer: number | string;

  /**
   * Template of the `CalendarEvent`
   */
  template: number | string;

  /**
   * Date of the `CalendarEvent`
   */
  date: Date;

  /**
   * Whether the mask is required in the `CalendarEvent`
   */
  maskRequired: boolean;

  /**
   * Whether the covid passport is required in the `CalendarEvent`
   */
  covidPassport: boolean;

  /**
   * Start time of the `CalendarEvent`
   */
  startTime: string;

  /**
   * End time of the `CalendarEvent`
   */
  endTime: string;

  /**
   * Capacity of the `CalendarEvent`
   */
  capacity: number;

  /**
   * Event type of the `CalendarEvent`
   */
  type: number | string;

  /**
   * Difficulty of the `CalendarEvent`
   */
  difficulty: number | string;
};
