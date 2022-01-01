import { GymZone } from '@gymman/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class GymZoneService extends BaseService<GymZone> {
  constructor(repoAccessor: RepositoryAccessor<GymZone>) {
    super(GymZone, repoAccessor);
  }
}
