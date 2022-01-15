import * as ClassValidator from 'class-validator';

import { CalendarDate } from '@hubbl/shared/models/entities';

import * as helpers from '@hubbl/shared/models/helpers';
import CalendarDateDTO from './CalendarDate';

jest.mock('@hubbl/shared/models/entities');
jest.mock('@hubbl/shared/models/helpers');

describe('CalendarDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = { year: 2022, month: 1, day: 1 };

      const result = await CalendarDateDTO.fromJson(json);

      expect(result).toBeDefined();
      expect(result.year).toBe(json.year);
      expect(result.month).toBe(json.month);
      expect(result.day).toBe(json.day);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(result, {
        validationError: { target: false }
      });
    });

    it('should throw if date is not valid', async () => {
      const json = { year: 2022, month: 2, day: 29 };

      expect.assertions(2);

      try {
        await CalendarDateDTO.fromJson(json);
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
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await CalendarDateDTO.fromJson(json);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a CalendarDateDTO from a correct CalendarDate', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();
      const date = new CalendarDate();

      date.year = 2000;
      date.month = 6;
      date.day = 29;

      const result = await CalendarDateDTO.fromClass(date);

      expect(result).toBeDefined();
      expect(result.year).toBe(date.year);
      expect(result.month).toBe(date.month);
      expect(result.day).toBe(date.day);

      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a CalendarDateDTO from an incorrect CalendarDate', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(helpers, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await CalendarDateDTO.fromClass({} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a CalendarDate', () => {
      const dto = new CalendarDateDTO();

      dto.year = 2000;
      dto.month = 6;
      dto.day = 29;

      const result = dto.toClass();

      expect(result).toBeInstanceOf(CalendarDate);
      expect(result.year).toBe(dto.year);
      expect(result.month).toBe(dto.month);
      expect(result.day).toBe(dto.day);
    });
  });
});
