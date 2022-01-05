import * as ClassValidator from 'class-validator';

import { Calendar, EventType, VirtualGym } from '@hubbl/shared/models/entities';
import { AppPalette } from '@hubbl/shared/types';

import * as Util from '../util';
import EventTypeDTO from './EventType';

jest.mock('@hubbl/shared/models/entities');

const propCompare = (
  want: EventType | EventTypeDTO,
  got: EventType | EventTypeDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.labelColor).toBe(want.labelColor);
  expect(got.gym).toBe(want.gym);
};

describe('EventType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        name: 'Virtual',
        description: 'Description',
        labelColor: AppPalette.BLUE,
        gym: 1
      };

      const result = await EventTypeDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(EventTypeDTO), {
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
        await EventTypeDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a EventTypeDTO from a correct EventType', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const eventType = new EventType();
      const calendar = new Calendar();
      const virtualGym = new VirtualGym();

      calendar.id = 1;
      virtualGym.id = 1;

      eventType.id = 1;
      eventType.name = 'Test';
      eventType.description = '';
      eventType.labelColor = AppPalette.BLUE;
      eventType.gym = 1;

      const result = await EventTypeDTO.fromClass(eventType);

      expect(result).toBeDefined();
      propCompare(eventType, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a EventTypeDTO from an incorrect EventType', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await EventTypeDTO.fromClass({} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a EventType', () => {
      const dto = new EventTypeDTO();

      dto.id = 1;
      dto.name = 'Test';
      dto.description = '';
      dto.labelColor = AppPalette.BLUE;
      dto.gym = 1;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
