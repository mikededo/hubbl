import { Gym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class GymService extends BaseService<Gym> {
  constructor(repoAccessor: RepositoryAccessor<Gym>) {
    super(Gym, repoAccessor);
  }
}
