import { GymZone } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import GymZoneService from './GymZone.service';

jest.mock('../Base');

describe('GymZoneService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new GymZoneService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(GymZone, mockRepoAccesser);
    });
  });
});
