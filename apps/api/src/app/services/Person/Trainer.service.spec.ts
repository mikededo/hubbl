import { Trainer } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import TrainerService from './Trainer.service';

jest.mock('../Base');

describe('TrainerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new TrainerService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Trainer);
    });
  });
});
