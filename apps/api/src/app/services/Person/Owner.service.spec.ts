import { Owner } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import OwnerService from './Owner.service';

jest.mock('../Base');

describe('OwnerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new OwnerService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Owner);
    });
  });
});
