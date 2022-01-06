import { EventAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import EventAppointmentService from './EventAppointment.service';

jest.mock('../Base');

describe('EventAppointmentService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new EventAppointmentService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(EventAppointment, mockRepoAccesser);
    });
  });
});
