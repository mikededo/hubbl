import * as ClassValidator from 'class-validator';

import {
  CalendarAppointment,
  CalendarDate
} from '@hubbl/shared/models/entities';

import * as Util from '../util';
import CalendarAppointmentDTO from './CalendarAppointment';
import { CalendarDateDTO } from '..';

jest.mock('@hubbl/shared/models/entities');

const propCompare = (
  want: CalendarAppointment | CalendarAppointmentDTO,
  got: CalendarAppointment | CalendarAppointmentDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.startTime).toBe(want.startTime);
  expect(got.endTime).toBe(want.endTime);
  expect(got.cancelled).toBe(want.cancelled);
  expect(got.client).toBe(want.client);
  expect(got.calendar).toBe(want.calendar);
  expect(got.date.year).toBe(want.date.year);
  expect(got.date.month).toBe(want.date.month);
  expect(got.date.day).toBe(want.date.day);
};

describe('Event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        startTime: '09:00:00',
        endTime: '10:00:00',
        cancelled: false,
        event: 1,
        client: 1,
        date: { day: 29, month: 6, year: 2000 } as CalendarDate
      };

      const calendarJsonSpy = jest
        .spyOn(CalendarDateDTO, 'fromJson')
        .mockResolvedValue({ day: 29, month: 6, year: 2000 } as any);

      const result = await CalendarAppointmentDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Parse calendar
      expect(calendarJsonSpy).toHaveBeenCalledTimes(1);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(2);
      expect(vorSpy).toHaveBeenNthCalledWith(
        1,
        { day: 29, month: 6, year: 2000 },
        { validationError: { target: false } }
      );
      expect(vorSpy).toHaveBeenNthCalledWith(
        2,
        expect.any(CalendarAppointmentDTO),
        { validationError: { target: false }, groups: ['any'] }
      );
    });

    it('should not create a DTO if date json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await CalendarAppointmentDTO.fromJson({ date: {} }, 'any' as any);
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
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);
      jest.spyOn(CalendarDateDTO, 'fromJson').mockResolvedValue({} as any);

      expect.assertions(3);

      try {
        await CalendarAppointmentDTO.fromJson({ date: {} }, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(2);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an CalendarAppointmentDTO from a correct CalendarAppointment', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const appointment = new CalendarAppointment();
      const date = new CalendarDate();

      date.day = 29;
      date.month = 6;
      date.year = 2000;

      appointment.id = 1;
      appointment.startTime = '09:00:00';
      appointment.endTime = '10:00:00';
      appointment.cancelled = false;
      appointment.client = 1;
      appointment.calendar = 1;
      appointment.date = date;

      const result = await CalendarAppointmentDTO.fromClass(appointment);

      expect(result).toBeDefined();
      propCompare(appointment, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a CalendarAppointmentDTO from an incorrect CalendarAppointment', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await CalendarAppointmentDTO.fromClass({ date: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a CalendarAppointment', () => {
      const dto = new CalendarAppointmentDTO();

      dto.id = 1;
      dto.startTime = '09:00:00';
      dto.endTime = '10:00:00';
      dto.cancelled = false;
      dto.client = 1;
      dto.calendar = 1;
      dto.date = { day: 29, month: 6, year: 2000 } as CalendarDate;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
