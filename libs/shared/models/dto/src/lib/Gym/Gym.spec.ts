import * as ClassValidator from 'class-validator';

import { ThemeColor } from '@gymman/shared/types';

import * as Util from '../util';
import GymDTO from './Gym';
import { Gym } from '@gymman/shared/models/entities';

describe('Gym', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe('#fromJson', () => {
    it('should create a DTO if fromJson is valid', async () => {
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
      expect(result.id).toBe(json.id);
      expect(result.name).toBe(json.name);
      expect(result.email).toBe(json.email);
      expect(result.phone).toBe(json.phone);
      expect(result.color).toBe(json.color);
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
        .spyOn(Util, 'validationParser')
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
      gym.eventTypes = [];
      gym.virtualGyms = [];

      const result = await GymDTO.fromClass(gym);

      expect(result.id).toBe(gym.id);
      expect(result.name).toBe(gym.name);
      expect(result.email).toBe(gym.email);
      expect(result.phone).toBe(gym.phone);
      expect(result.color).toBe(gym.color);
      expect(result.eventTypes).toBe(gym.eventTypes);
      expect(result.virtualGyms).toBe(gym.virtualGyms);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating a GymDTO from an incorrect Gym', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

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
      dto.eventTypes = [];
      dto.virtualGyms = [];

      const result = dto.toClass();

      expect(result.id).toBe(dto.id);
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
      expect(result.phone).toBe(dto.phone);
      expect(result.color).toBe(dto.color);
      expect(result.eventTypes).toBe(dto.eventTypes);
      expect(result.virtualGyms).toBe(dto.virtualGyms);
    });
  });
});
