import { VirtualGym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import VirtualGymService from './VirtualGym.service';

jest.mock('../Base');

describe('VirtualGymService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new VirtualGymService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(VirtualGym);
    });
  });
});
