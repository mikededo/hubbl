import { Owner } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class OwnerService extends BaseService<Owner> {
  constructor() {
    super(Owner);
  }
}
