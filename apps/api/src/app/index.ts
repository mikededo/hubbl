import { Application } from 'express';
import middlewares from './middlewares';

import initRoutes from './routes';

export default (app: Application) => {
  app.use(middlewares.preRequest);
  app.use(middlewares.postRequest);

  initRoutes(app);
};
