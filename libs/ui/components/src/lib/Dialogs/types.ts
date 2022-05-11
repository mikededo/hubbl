import { TrainerTagDTO } from '@hubbl/shared/models/dto';
import { AppPalette, Gender, GymZoneIntervals } from '@hubbl/shared/types';

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

export type CalendarAppointmentFormFields = {
  /**
   * Date of the `CalendarAppointment`
   */
  date: Date;

  /**
   * Start time of the `CalendarAppointment`
   */
  startTime: string;

  /**
   * End time of the `CalendarAppointment`
   */
  endTime: string;

  /**
   * Selected interval of the user. This value will not be
   * passed to the callback as it is just to keep the internal
   * state
   */
  interval: GymZoneIntervals;
};

export type PersonFormFields = {
  /**
   * `Person`'s first name
   */
  firstName: string;

  /**
   * `Person`'s last name
   */
  lastName: string;

  /**
   * `Person`'s email
   */
  email: string;

  /**
   * `Person`'s password
   */
  password: string;

  /**
   * `Person`'s phone
   */
  phone: string;

  /**
   * `Person`'s Gender
   */
  gender: Gender;
};

export type TrainerFormFields = {
  /**
   * Identifiers of the selected trainer tags
   */
  tags: number[];
} & PersonFormFields;

export type ParsedTrainerFormFields = {
  /**
   * List of trainer tags that have been selected
   */
  tags: TrainerTagDTO[];
} & PersonFormFields;

export type ClientFormFields = {
  /**
   * Whether the client has the covid passport or not
   */
  covidPassport: boolean;
} & PersonFormFields;

export type WorkerFormFields = {
  /**
   * Whether the worker is allowed or not to UPDATE `VirtualGym`'s
   */
  updateVirtualGyms: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `GymZone`'s
   */
  createGymZones: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `GymZone`'s
   */
  updateGymZones: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `GymZone`'s
   */
  deleteGymZones: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `Trainer`'s
   */
  createTrainers: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `Trainer`'s
   */
  updateTrainers: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `Trainer`'s
   */
  deleteTrainers: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `Client`'s
   */
  createClients: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `Client`'s
   */
  updateClients: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `Client`'s
   */
  deleteClients: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `Tag`'s of any kind.
   */
  createTags: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `Tag`'s of any kind.
   */
  updateTags: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `Tag`'s of any kind.
   */
  deleteTags: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `Event`'s
   */
  createEvents: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `Event`'s
   */
  updateEvents: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `Event`'s
   */
  deleteEvents: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `EventType`'s
   */
  createEventTypes: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `EventType`'s
   */
  updateEventTypes: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `EventType`'s
   */
  deleteEventTypes: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `EventTemplates`'s
   */
  createEventTemplates: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `EventTemplates`'s
   */
  updateEventTemplates: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `EventTemplates`'s
   */
  deleteEventTemplates: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `EventAppointment`'s
   */
  createEventAppointments: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `EventAppointment`'s
   */
  updateEventAppointments: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `EventAppointment`'s
   */
  deleteEventAppointments: boolean;

  /**
   * Whether the worker is allowed or not to CREATE `CalendarAppointment`'s
   */
  createCalendarAppointments: boolean;

  /**
   * Whether the worker is allowed or not to UPDATE `CalendarAppointment`'s
   */
  updateCalendarAppointments: boolean;

  /**
   * Whether the worker is allowed or not to DELETE `CalendarAppointment`'s
   */
  deleteCalendarAppointments: boolean;
} & PersonFormFields;
