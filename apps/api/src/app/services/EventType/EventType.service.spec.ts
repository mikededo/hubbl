import { EventType } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import EventTypeService from './EventType.service';

jest.mock('../Base');

describe('EventTypeService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new EventTypeService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(EventType);
    });
  });
});
