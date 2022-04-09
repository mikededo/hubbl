import { DataSource } from 'typeorm';

import config from './database';

const source = new DataSource(config);

export default source;
