import { Application } from 'express';

import initRoutes from './routes';

export default (app: Application) => {
  initRoutes(app);
};
