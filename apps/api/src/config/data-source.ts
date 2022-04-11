import { DataSource } from 'typeorm';

import config, { testConfig } from './database';

const source = new DataSource(config);

const testSource = new DataSource(testConfig);

export default source;

export { testSource as TestSource };
