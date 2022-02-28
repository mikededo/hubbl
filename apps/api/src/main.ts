import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { json } from 'express';

import initApp from './app';

const app: express.Application = express();

app.use(
  cors({
    origin: 'http://core.hubbl.local:4200',
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
  })
);
app.use(json());
app.use(cookieParser());

initApp(app);

export default app;
