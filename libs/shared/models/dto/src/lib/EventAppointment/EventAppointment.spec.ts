import * as ClassValidator from 'class-validator';

import { Client, Event, EventAppointment } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import EventAppointmentDTO from './EventAppointment';

jest.mock('@hubbl/shared/models/entities');
jest.mock('@hubbl/shared/models/helpers');

const propCompare = (
  want: EventAppointment | EventAppointmentDTO,
  got: EventAppointment | EventAppointmentDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.startTime).toBe(want.startTime);
  expect(got.endTime).toBe(want.endTime);
  expect(got.cancelled).toBe(want.cancelled);
  expect(got.client).toBe(
    want.client instanceof Client ? want.client.person.id : want.client
  );
  expect(got.event).toBe(
    want.event instanceof Event ? want.event.id : want.event
  );
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
        client: 1
      };

      const result = await EventAppointmentDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(EventAppointmentDTO), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create a DTO if json is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await EventAppointmentDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an EventAppointmentDTO from a correct EventAppointment', () => {
      const appointment = new EventAppointment();

      appointment.id = 1;
      appointment.startTime = '09:00:00';
      appointment.endTime = '10:00:00';
      appointment.cancelled = false;
      appointment.client = 1;
      appointment.event = 1;

      const result = EventAppointmentDTO.fromClass(appointment);

      expect(result).toBeDefined();
      propCompare(appointment, result);
    });
  });

  describe('#toClass', () => {
    it('should return a EventAppointment', () => {
      const dto = new EventAppointmentDTO();

      dto.id = 1;
      dto.startTime = '09:00:00';
      dto.endTime = '10:00:00';
      dto.cancelled = false;
      dto.client = 1;
      dto.event = 1;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
