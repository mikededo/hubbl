import 'reflect-metadata';

import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { json } from 'express';
import * as log from 'npmlog';
import { createConnection } from 'typeorm';

import initApp from './app';
import { databaseConfig } from './config';
import app from './main';

log.enableColor();

createConnection(databaseConfig)
  .then(async (cnt) => {
    log.info('App', 'Connection created');

    await cnt.synchronize(true);

    const port = process.env.port || 3333;

    app.use(cors());
    app.use(json());
    app.use(cookieParser());

    initApp(app);

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
