import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Owner, Person } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import GymDTO from '../Gym';
import * as Util from '../util';
import OwnerDTO from './Owner';

describe('OwnerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    it('should create a DTO if fromJson is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        theme: AppTheme.LIGHT,
        gym: { id: 1, name: 'Test Gym', email: 'test@gym.com' },
        gender: Gender.OTHER
      };

      const result = await OwnerDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(OwnerDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.theme).toBe(json.theme);
      expect(result.gym).toBe(json.gym);
      expect(result.gender).toBe(json.gender);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalled();
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create the DTO if fromJson is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await OwnerDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an OwnerDTO from a correct Owner', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();
      const password = await hash('testpwd00', await genSalt(10));

      const owner = new Owner();
      const person = new Person();
      const gym = new Gym();

      person.id = 1;
      person.email = 'test@user.com';
      person.password = password;
      person.firstName = 'Test';
      person.lastName = 'User';
      person.gender = Gender.OTHER;
      person.theme = AppTheme.LIGHT;

      gym.id = 1;
      gym.name = 'Test';
      gym.email = 'test@gym.com';

      owner.person = person;
      owner.person.gym = gym;

      jest.spyOn(GymDTO, 'fromJson').mockResolvedValue({
        ...gym,
        toClass: jest.fn().mockReturnValue(gym)
      });

      const result = await OwnerDTO.fromClass(owner);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@user.com');
      expect(result.password).toBe(password);
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.theme).toBe(AppTheme.LIGHT);
      expect(result.gender).toBe(Gender.OTHER);
      expect(result.gym).toBeInstanceOf(Gym);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalled();
    });

    it('should fail on creating an OwnerDTO from an incorrect Owner', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      jest.spyOn(GymDTO, 'fromClass').mockResolvedValue({
        toClass: jest.fn().mockReturnValue({})
      } as any);

      expect.assertions(3);

      try {
        await OwnerDTO.fromClass({ person: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalled();
      expect(vpSpy).toHaveBeenCalled();
    });

    it('should fail on creating an OwnerDTO from an incorrect Gym', async () => {
      jest.spyOn(GymDTO, 'fromClass').mockImplementation(() => {
        throw new Error();
      });

      expect.assertions(1);

      try {
        await OwnerDTO.fromClass({ person: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('#toClass', () => {
    it('should return an owner', async () => {
      // Set up class
      const dto = new OwnerDTO();
      dto.id = 1;
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;
      dto.theme = AppTheme.LIGHT;

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
