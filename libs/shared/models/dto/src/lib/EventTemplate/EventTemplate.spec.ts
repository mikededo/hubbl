import * as ClassValidator from 'class-validator';

import { EventTemplate, EventType } from '@hubbl/shared/models/entities';

import * as Util from '../util';
import EventTemplateDTO from './EventTemplate';

jest.mock('@hubbl/shared/models/entities');

const propCompare = (
  want: EventTemplate | EventTemplateDTO,
  got: EventTemplate | EventTemplateDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.type).toBe(
    want.type instanceof EventType ? want.type.id : want.type
  );
  expect(got.gym).toBe(want.gym);
};

describe('EventTemplate', () => {
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
        type: 1,
        gym: 1
      };

      const result = await EventTemplateDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(EventTemplateDTO), {
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
        await EventTemplateDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a EventTemplateDTO from a correct EventTemplate', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const eventTemplate = new EventTemplate();
      const eventType = new EventType();

      eventType.id = 1;

      eventTemplate.id = 1;
      eventTemplate.name = 'Test';
      eventTemplate.description = '';
      eventTemplate.type = eventType;
      eventTemplate.gym = 1;

      const result = await EventTemplateDTO.fromClass({
        ...eventTemplate,
        eventCount: 5
      } as any);

      expect(result).toBeDefined();
      propCompare(eventTemplate, result);

      // Additional fields
      expect(result.eventCount).toBe(5);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a EventTemplateDTO from an incorrect EventTemplate', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await EventTemplateDTO.fromClass({} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a EventTemplate', () => {
      const dto = new EventTemplateDTO();

      dto.id = 1;
      dto.name = 'Test';
      dto.description = '';
      dto.type = 1;
      dto.gym = 1;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
