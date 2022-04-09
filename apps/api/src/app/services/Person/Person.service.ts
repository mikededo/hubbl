import { Person } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class PersonService extends BaseService<Person> {
  constructor() {
    super(Person);
  }
}
