import { Client } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class ClientService extends BaseService<Client> {
  constructor() {
    super(Client);
  }
}
