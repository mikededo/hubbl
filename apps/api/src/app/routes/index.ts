import { Application } from 'express';

import PersonRouter from './Persons.routes';

const Routes = {
  persons: PersonRouter
};

export default (app: Application) => {
  Object.entries(Routes).forEach(([path, router]) => {
    app.use(`/api/${path}`, router);
  });
};
