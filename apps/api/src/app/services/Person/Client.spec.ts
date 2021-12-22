import ClientService from './Client.service';
import BaseService from '../Base';
import { Client } from '@gymman/shared/models/entities';

jest.mock('../Base');

describe('ClientService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();
      
      new ClientService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Client, mockRepoAccesser);
    });
  });
});
