import { Worker } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class WorkerService extends BaseService<Worker> {
  constructor() {
    super(Worker);
  }
}
