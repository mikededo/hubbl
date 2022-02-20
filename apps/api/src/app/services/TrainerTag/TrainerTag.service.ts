import { TrainerTag } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class TrainerTagService extends BaseService<TrainerTag> {
  constructor(repoAccessor: RepositoryAccessor<TrainerTag>) {
    super(TrainerTag, repoAccessor);
  }
}
