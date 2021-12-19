import { Worker } from '@gymman/shared/models/entities';

import BaseService from '../Base';
import WorkerService from './Worker.service';

jest.mock('../Base');

describe('WorkerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new WorkerService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Worker, mockRepoAccesser);
    });
  });
});
