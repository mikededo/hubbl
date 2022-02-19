import { TrainerTag } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import TrainerTagService from './TrainerTag.service';

jest.mock('../Base');

describe('TrainerTagService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new TrainerTagService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(TrainerTag, mockRepoAccesser);
    });
  });
});
