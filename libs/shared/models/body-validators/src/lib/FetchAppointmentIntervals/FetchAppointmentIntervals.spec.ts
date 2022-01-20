import * as ClassValidator from 'class-validator';

import { CalendarDate } from '@hubbl/shared/models/entities';
import { CalendarDateDTO } from '@hubbl/shared/models/dto';
import * as helpers from '@hubbl/shared/models/helpers';

import FetchAppointmentInterval from './FetchAppointmentIntervals';
import { GymZoneIntervals } from '@hubbl/shared/types';

jest.mock('@hubbl/shared/models/dto');
jest.mock('@hubbl/shared/models/helpers');

const createCalendarDate = (): CalendarDate => {
  const result = new CalendarDate();

  result.year = 2000;
  result.month = 6;
  result.day = 29;

  return result;
};

describe('FetchAppointmentInterval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#validate', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const body = {
        interval: GymZoneIntervals.HOURTHIRTY,
        date: createCalendarDate()
      };

      const calendarJsonSpy = jest
        .spyOn(CalendarDateDTO, 'fromJson')
        .mockResolvedValue({ day: 29, month: 6, year: 2000 } as any);

      const result = await FetchAppointmentInterval.validate(body);

      expect(result).toBeDefined();

      // Parse calendar
      expect(calendarJsonSpy).toHaveBeenCalledTimes(1);
      expect(calendarJsonSpy).toHaveBeenCalledWith(body.date);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(2);
      expect(vorSpy).toHaveBeenNthCalledWith(
        1,
        { day: 29, month: 6, year: 2000 },
        { validationError: { target: false } }
      );
      expect(vorSpy).toHaveBeenNthCalledWith(2, body, {
        validationError: { target: false }
      });
    });

    it('should not create a DTO if date json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await FetchAppointmentInterval.validate({ date: {} });
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });

    it('should not create a DTO if json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValueOnce()
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);
      jest.spyOn(CalendarDateDTO, 'fromJson').mockResolvedValue({} as any);

      expect.assertions(3);

      try {
        await FetchAppointmentInterval.validate({ date: {} });
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(2);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });
});
