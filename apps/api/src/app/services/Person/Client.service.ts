import { Client } from '@gymman/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class ClientService extends BaseService<Client> {
  constructor(repoAccessor: RepositoryAccessor<Client>) {
    super(Client, repoAccessor);
  }
}
