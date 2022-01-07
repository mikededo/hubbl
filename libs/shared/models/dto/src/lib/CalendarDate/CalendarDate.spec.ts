import * as ClassValidator from 'class-validator';

import * as Util from '../util';
import CalendarDateDTO from './CalendarDate';

jest.mock('@hubbl/shared/models/entities');

describe('CalendarDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = { year: 2022, month: 1, day: 1 };

      const result = await CalendarDateDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result.year).toBe(json.year);
      expect(result.month).toBe(json.month);
      expect(result.day).toBe(json.day);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(result, {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should throw if date is not valid', async () => {
      const json = { year: 2022, month: 2, day: 29 };

      expect.assertions(2);

      try {
        await CalendarDateDTO.fromJson(json, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBe('Date is not valid');
      }
    });

    it('should not create the DTO if json is not valid', async () => {
      const json = { year: 2022, month: 1, day: 1 };
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await CalendarDateDTO.fromJson(json, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });
});
