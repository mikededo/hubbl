import { Worker } from '@gymman/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class WorkerService extends BaseService<Worker> {
  constructor(repoAccessor: RepositoryAccessor<Worker>) {
    super(Worker, repoAccessor);
  }
}
