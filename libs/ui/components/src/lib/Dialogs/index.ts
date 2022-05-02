import type { UseEventDialogResult } from './CalendarEventDialog';
import CalendarEventDialog, {
  useCalendarEventDialog
} from './CalendarEventDialog';
import ClientDialog from './ClientDialog';
import EventTemplateDialog from './EventTemplateDialog';
import EventTypeDialog from './EventTypeDialog';
import GymZoneDialog from './GymZoneDialog';
import TrainerDialog from './TrainerDialog';
import type {
  CalendarEventFormFields,
  ClientFormFields,
  EventTemplateFormFields,
  EventTypeFormFields,
  GymZoneFormFields,
  ParsedTrainerFormFields,
  TrainerFormFields,
  VirtualGymFormFields
} from './types';
import VirtualGymDialog from './VirtualGymDialog';

export {
  CalendarEventDialog,
  ClientDialog,
  EventTemplateDialog,
  EventTypeDialog,
  GymZoneDialog,
  TrainerDialog,
  useCalendarEventDialog,
  VirtualGymDialog
};
export type {
  CalendarEventFormFields,
  ClientFormFields,
  EventTemplateFormFields,
  EventTypeFormFields,
  GymZoneFormFields,
  ParsedTrainerFormFields,
  TrainerFormFields,
  UseEventDialogResult,
  VirtualGymFormFields
};
