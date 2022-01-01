import { Trainer } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class TrainerService extends BaseService<Trainer> {
  constructor(repoAccessor: RepositoryAccessor<Trainer>) {
    super(Trainer, repoAccessor);
  }
}
