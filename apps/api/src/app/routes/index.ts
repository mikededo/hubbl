import { Application } from 'express';
import * as log from 'npmlog';

import PersonRouter from './Persons.routes';
import VirtualGymRouter from './VirtualGym.routes';

const Routes = {
  persons: PersonRouter,
  'virtual-gyms': VirtualGymRouter
};

export default (app: Application) => {
  Object.entries(Routes).forEach(([path, router]) => {
    log.info('App[Router]', `Attached router [${path}]`);

    app.use(`/api/${path}`, router);
  });
};
