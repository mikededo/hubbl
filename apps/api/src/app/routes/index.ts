import { Application } from 'express';
import * as log from 'npmlog';

import AppointmentsRouter from './Appointments.routes';
import CalendarRouter from './Calendars.routes';
import DashboardRouter from './Dashboard.routes';
import EventRouter from './Events.routes';
import EventTemplateRouter from './EventTemplates.routes';
import EventTypeRouter from './EventTypes.routes';
import GymRouter from './Gym.routes';
import PersonRouter from './Persons.routes';
import TagRouter from './Tags.routes';
import TokenRouter from './Token.routes';
import VirtualGymRouter from './VirtualGym.routes';

const Routes = {
  appointments: AppointmentsRouter,
  calendars: CalendarRouter,
  dashboards: DashboardRouter,
  events: EventRouter,
  'event-templates': EventTemplateRouter,
  'event-types': EventTypeRouter,
  gyms: GymRouter,
  persons: PersonRouter,
  tags: TagRouter,
  tokens: TokenRouter,
  'virtual-gyms': VirtualGymRouter
};

export default (app: Application) => {
  Object.entries(Routes).forEach(([path, router]) => {
    log.info('App[Router]', `Attached router [${path}]`);

    if (process.env.NODE_ENV === 'test') {
      app.use(`/${path}`, router);
    } else {
      app.use(`/api/${path}`, router);
    }
  });
};
