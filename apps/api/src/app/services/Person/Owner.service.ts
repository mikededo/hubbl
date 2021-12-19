import { Repository } from 'typeorm';

import { Owner } from '@gymman/shared/models/entities';

import { RepositoryAccessor } from '../util';

export default class OwnerService {
  private repository: Repository<Owner>;

  constructor(public repoAccesser: RepositoryAccessor<Owner>) {
    this.repository = repoAccesser(Owner, 'postgres');
  }

  public save(owner: Owner): Promise<Owner> {
    return this.repository.save(owner);
  }
}
