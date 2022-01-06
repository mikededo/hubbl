import * as ClassValidator from 'class-validator';

import { EventAppointment } from '@hubbl/shared/models/entities';

import * as Util from '../util';
import EventAppointmentDTO from './EventAppointment';

jest.mock('@hubbl/shared/models/entities');

const propCompare = (
  want: EventAppointment | EventAppointmentDTO,
  got: EventAppointment | EventAppointmentDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.startTime).toBe(want.startTime);
  expect(got.endTime).toBe(want.endTime);
  expect(got.cancelled).toBe(want.cancelled);
  expect(got.client).toBe(want.client);
  expect(got.event).toBe(want.event);
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
        .spyOn(Util, 'validationParser')
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
    it('should create an EventAppointmentDTO from a correct EventAppointment', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const event = new EventAppointment();

      event.id = 1;
      event.startTime = '09:00:00';
      event.endTime = '10:00:00';
      event.cancelled = false;
      event.client = 1;
      event.event = 1;

      const result = await EventAppointmentDTO.fromClass(event);

      expect(result).toBeDefined();
      propCompare(event, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a EventAppointmentDTO from an incorrect EventAppointment', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await EventAppointmentDTO.fromClass({} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
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
