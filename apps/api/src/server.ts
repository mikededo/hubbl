import 'reflect-metadata';

import * as log from 'npmlog';

import { Source } from './config';
import app from './main';

log.enableColor();

Source.initialize()
  .then(async (cnt) => {
    log.info('App', 'Connection created');

    await cnt.synchronize(true);

    const port = process.env.port || 3333;

    log.info('App', 'App initialised');

    const server = app.listen(port, () => {
      log.info('App', `Listening at http://localhost:${port}/api`);
    });

    server.on('error', (e) => {
      log.error('App', e.message);
    });
  })
  .catch((err) => {
    log.error('App', 'Unable to connect to postgres', err);

    process.exit(1);
  });
