import { TrainerTag } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import TrainerTagService from './TrainerTag.service';

jest.mock('../Base');

describe('TrainerTagService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new TrainerTagService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(TrainerTag);
    });
  });
});
