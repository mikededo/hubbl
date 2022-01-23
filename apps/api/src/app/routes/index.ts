import { Application } from 'express';
import * as log from 'npmlog';
import AppointmentsRouter from './Appointments.routes';
import CalendarRouter from './Calendars.routes';
import EventRouter from './Events.routes';

import EventTemplateRouter from './EventTemplates.routes';
import EventTypeRouter from './EventTypes.routes';
import PersonRouter from './Persons.routes';
import TokenRouter from './Token.routes';
import VirtualGymRouter from './VirtualGym.routes';

const Routes = {
  appointments: AppointmentsRouter,
  calendars: CalendarRouter,
  events: EventRouter,
  'event-templates': EventTemplateRouter,
  'event-types': EventTypeRouter,
  persons: PersonRouter,
  'tokens': TokenRouter,
  'virtual-gyms': VirtualGymRouter
};

export default (app: Application) => {
  Object.entries(Routes).forEach(([path, router]) => {
    log.info('App[Router]', `Attached router [${path}]`);

    app.use(`/api/${path}`, router);
  });
};
