import TrainerService from './Trainer.service';
import BaseService from '../Base';
import { Trainer } from '@hubbl/shared/models/entities';

jest.mock('../Base');

describe('TrainerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new TrainerService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Trainer, mockRepoAccesser);
    });
  });
});
