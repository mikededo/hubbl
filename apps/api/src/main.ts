import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { json } from 'express';

import initApp from './app';

const app: express.Application = express();

app.use(cors());
app.use(json());
app.use(cookieParser());

initApp(app);

export default app;
