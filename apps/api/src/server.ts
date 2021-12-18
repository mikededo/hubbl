import 'reflect-metadata';

import * as cors from 'cors';
import { json } from 'express';
import { createConnection } from 'typeorm';

import { databaseConfig } from './config';
import app from './main';

createConnection(databaseConfig)
  .then(async (cnt) => {
    await cnt.synchronize(true);

    const port = process.env.port || 3333;

    app.use(cors());
    app.use(json());

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });

    server.on('error', console.error);
  })
  .catch((err) => {
    console.log('Unable to connect to postgres', err);
    process.exit(1);
  });
