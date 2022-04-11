import { Worker } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import WorkerService from './Worker.service';

jest.mock('../Base');

describe('WorkerService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new WorkerService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Worker);
    });
  });
});
