import { Owner } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class OwnerService extends BaseService<Owner> {
  constructor(accessor: RepositoryAccessor<Owner>) {
    super(Owner, accessor);
  }
}
