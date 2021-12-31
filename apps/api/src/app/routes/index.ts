import { Application } from 'express';

import PersonRouter from './Persons.routes';
import GymZoneRouter from './GymZone.routes';
import VirtualGymRouter from './VirtualGym.routes';

const Routes = {
  persons: PersonRouter,
  'virtual-gyms': VirtualGymRouter,
  'gym-zones': GymZoneRouter
};

export default (app: Application) => {
  Object.entries(Routes).forEach(([path, router]) => {
    app.use(`/api/${path}`, router);
  });
};
