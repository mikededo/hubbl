import { DataSource } from 'typeorm';

import config from './database';

const source = new DataSource(config);

const { getRepository } = source;

export default source;

export { getRepository };
