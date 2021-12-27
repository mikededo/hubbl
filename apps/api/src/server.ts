import 'reflect-metadata';

import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { createConnection } from 'typeorm';

import initApp from './app';
import { databaseConfig } from './config';
import app from './main';

createConnection(databaseConfig)
  .then(async (cnt) => {
    await cnt.synchronize(true);

    const port = process.env.port || 3333;

    app.use(cors());
    app.use(json());
    app.use(cookieParser());

    initApp(app);

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });

    server.on('error', console.error);
  })
  .catch((err) => {
    console.log('Unable to connect to postgres', err);
    process.exit(1);
  });
