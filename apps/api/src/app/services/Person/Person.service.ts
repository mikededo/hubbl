import { Person } from '@gymman/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class PersonService extends BaseService<Person> {
  constructor(accessor: RepositoryAccessor<Person>) {
    super(Person, accessor);
  }
}
