import * as ClassValidator from 'class-validator';

import { Gym } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';
import { ThemeColor } from '@hubbl/shared/types';

import GymDTO from './Gym';

jest.mock('@hubbl/shared/models/helpers');

const propCompare = (want: Gym | GymDTO, got: Gym | GymDTO) => {
  expect(got.id).toBe(want.id);
  expect(got.name).toBe(want.name);
  expect(got.email).toBe(want.email);
  expect(got.phone).toBe(want.phone);
  expect(got.color).toBe(want.color);
};

describe('Gym', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        name: 'Test',
        email: 'test@gym.com',
        phone: '000 000 000',
        color: ThemeColor.BLUE
      };

      const result = await GymDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(GymDTO);
      // Check fields
      propCompare(json as any, result);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create a DTO if fromJson not is valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(helpers, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await GymDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a GymDTO from a correct Gym', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();

      const gym = new Gym();
      gym.id = 1;
      gym.name = 'Test';
      gym.email = 'test@gym.com';
      gym.phone = '000 000 000';
      gym.color = ThemeColor.BLUE;
      gym.virtualGyms = [];

      const result = await GymDTO.fromClass(gym);

      propCompare(gym, result);
      expect(result.virtualGyms).toStrictEqual(gym.virtualGyms);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a GymDTO from an incorrect Gym', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(helpers, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await GymDTO.fromClass({ person: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a Gym', () => {
      const dto = new GymDTO();
      dto.id = 1;
      dto.name = 'Test';
      dto.email = 'test@gym.com';
      dto.phone = '000 000 000';
      dto.color = ThemeColor.BLUE;
      dto.virtualGyms = [];

      const result = dto.toClass();

      propCompare(dto, result);
    });

    it('should return a Gym with empty virtualGyms if the prop is undeinfed', () => {
      const dto = new GymDTO();
      dto.id = 1;
      dto.name = 'Test';
      dto.email = 'test@gym.com';
      dto.phone = '000 000 000';
      dto.color = ThemeColor.BLUE;

      const result = dto.toClass();

      propCompare(dto, result);
      expect(result.virtualGyms).toStrictEqual([]);
    });
  });
});
