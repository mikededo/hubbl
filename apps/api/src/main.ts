import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { databaseConfig } from './config';

const app: express.Application = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

createConnection(databaseConfig)
  .then(async (cnt) => {
    await cnt.synchronize(true);

    const port = process.env.port || 3333;

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });

    server.on('error', console.error);
  })
  .catch((err) => {
    console.log('Unable to connect to postgres', err);
    process.exit(1);
  });
