import * as ClassValidator from 'class-validator';

import { GymZone } from '@gymman/shared/models/entities';

import * as Util from '../util';
import GymZoneDTO from './GymZone';

const propCompare = (want: GymZone | GymZoneDTO, got: GymZone | GymZoneDTO) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.description).toBe(want.description);
  expect(got.isClassType).toBe(want.isClassType);
  expect(got.capacity).toBe(want.capacity);
  expect(got.maskRequired).toBe(want.maskRequired);
  expect(got.covidPassport).toBe(want.covidPassport);
  expect(got.openTime).toBe(want.openTime);
  expect(got.closeTime).toBe(want.closeTime);
  expect(got.timeIntervals).toStrictEqual(want.timeIntervals);
  expect(got.virtualGym).toBe(want.virtualGym);
};

describe('GymZone', () => {
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
        isClassType: true,
        capacity: 1000,
        maskRequired: true,
        covidPassport: true,
        openTime: '09:00:00',
        closeTime: '21:00:00',
        timeIntervals: [],
        virtualGym: 1
      };

      const result = await GymZoneDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      propCompare(json as any, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.any(GymZoneDTO), {
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
        await GymZoneDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a GymZoneDTO from a correct GymZone', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const gymZone = new GymZone();
      gymZone.id = 1;
      gymZone.name = 'Test';
      gymZone.description = '';
      gymZone.isClassType = false;
      gymZone.capacity = 1000;
      gymZone.maskRequired = true;
      gymZone.covidPassport = true;
      gymZone.openTime = '09:00:00';
      gymZone.closeTime = '21:00:00';
      gymZone.timeIntervals = [];
      gymZone.virtualGym = 1;

      const result = await GymZoneDTO.fromClass(gymZone);

      expect(result).toBeDefined();
      propCompare(gymZone, result);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a GymZoneDTO from an incorrect GymZone', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await GymZoneDTO.fromClass({} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a GymZone', () => {
      const dto = new GymZoneDTO();

      dto.id = 1;
      dto.name = 'Test';
      dto.description = '';
      dto.isClassType = false;
      dto.capacity = 1000;
      dto.maskRequired = true;
      dto.covidPassport = true;
      dto.openTime = '09:00:00';
      dto.closeTime = '21:00:00';
      dto.timeIntervals = [];
      dto.virtualGym = 1;

      const result = dto.toClass();

      propCompare(dto, result);
    });
  });
});
