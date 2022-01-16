import * as ClassValidator from 'class-validator';

import { VirtualGym } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import VirtualGymDTO from './VirtualGym';

jest.mock('@hubbl/shared/models/helpers');

const propCompare = (
  want: VirtualGym | VirtualGymDTO,
  got: VirtualGym | VirtualGymDTO
) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.location).toBe(want.location);
  expect(got.capacity).toBe(want.capacity);
  expect(got.openTime).toBe(want.openTime);
  expect(got.closeTime).toBe(want.closeTime);
  expect(got.gym).toBe(want.gym);
  expect(got.gymZones).toStrictEqual(want.gymZones);
};

describe('VirtualGym', () => {
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
        location: 'Location',
        capacity: 1000,
        openTime: '09:00:00',
        closeTime: '21:00:00',
        gym: 1
      };

      const result = await VirtualGymDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(VirtualGymDTO), {
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
        await VirtualGymDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a VirtualGymDTO from a correct VirtualGym', () => {
      const virtualGym = new VirtualGym();
      virtualGym.id = 1;
      virtualGym.name = 'Test';
      virtualGym.description = '';
      virtualGym.location = 'any';
      virtualGym.capacity = 1000;
      virtualGym.openTime = '09:00:00';
      virtualGym.closeTime = '21:00:00';
      virtualGym.gym = 1;

      const result = VirtualGymDTO.fromClass(virtualGym);

      expect(result).toBeDefined();
      propCompare({ ...virtualGym, gymZones: [] }, result);
    });
  });

  describe('#toClass', () => {
    it('should return a VirtualGym', () => {
      const dto = new VirtualGymDTO();

      dto.id = 1;
      dto.name = 'Test';
      dto.description = '';
      dto.location = 'any';
      dto.capacity = 1000;
      dto.openTime = '09:00:00';
      dto.closeTime = '21:00:00';
      dto.gym = 1;
      dto.gymZones = [];

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
