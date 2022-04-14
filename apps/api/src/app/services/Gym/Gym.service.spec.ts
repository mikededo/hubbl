import { Gym } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import GymService from './Gym.service';

jest.mock('../Base');

describe('GymService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new GymService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Gym);
    });
  });
});
