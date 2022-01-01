import OwnerService from './Owner.service';
import BaseService from '../Base';
import { Owner } from '@hubbl/shared/models/entities';

jest.mock('../Base');

describe('OwnerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new OwnerService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Owner, mockRepoAccesser);
    });
  });
});
