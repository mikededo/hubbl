import { VirtualGym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class VirtualGymService extends BaseService<VirtualGym> {
  constructor(repoAccessor: RepositoryAccessor<VirtualGym>) {
    super(VirtualGym, repoAccessor);
  }
}
