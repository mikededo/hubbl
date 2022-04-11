import { Event } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import EventService from './Event.service';

jest.mock('../Base');

describe('EventService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new EventService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Event);
    });
  });
});
