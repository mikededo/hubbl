import { Client } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import ClientService from './Client.service';

jest.mock('../Base');

describe('ClientService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new ClientService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Client);
    });
  });
});
