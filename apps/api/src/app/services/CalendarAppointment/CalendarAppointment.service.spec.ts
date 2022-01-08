import { CalendarAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import CalendarAppointmentService from './CalendarAppointment.service';

jest.mock('../Base');

describe('CalendarAppointmentService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new CalendarAppointmentService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(
        CalendarAppointment,
        mockRepoAccesser
      );
    });
  });
});
