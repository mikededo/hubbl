import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Person, Trainer } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import { PersonDTOGroups } from '../Person';
import * as Util from '../util';
import TrainerDTO from './Trainer';

describe('TrainerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    const successFromJSON = async (
      variant: PersonDTOGroups,
      gym: Gym | number
    ) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        theme: AppTheme.LIGHT,
        gym,
        gender: Gender.OTHER,
        managerId: 1,
        workerCode: 'some-uuid',
        events: []
      };

      const result = await TrainerDTO.fromJson<number>(json, variant);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(TrainerDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.theme).toBe(json.theme);
      expect(result.gender).toBe(json.gender);
      expect(result.gym).toBe(gym);
      // Trainer fields
      expect(result.managerId).toBe(json.managerId);
      expect(result.workerCode).toBe(json.workerCode);
      expect(result.events).toBe(json.events);

      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: [variant]
      });
    };

    const failFromJSON = async (variant: PersonDTOGroups) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await TrainerDTO.fromJson({}, variant);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    };

    it('[login, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.LOGIN, 1);
    });

    it('[login, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.LOGIN, new Gym());
    });

    it('[register, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.REGISTER, 1);
    });

    it('[register, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOGroups.REGISTER, new Gym());
    });

    it('[register] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOGroups.REGISTER);
    });

    it('[login] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOGroups.LOGIN);
    });
  });

  describe('#fromClass', () => {
    it('should create an TrainerDTO<Gym> from a correct Trainer', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const password = await hash('testpwd00', await genSalt(10));

      const trainer = new Trainer();
      const person = new Person();
      person.id = 1;
      person.email = 'test@user.com';
      person.password = password;
      person.firstName = 'Test';
      person.lastName = 'User';
      person.gender = Gender.OTHER;
      person.theme = AppTheme.LIGHT;
      person.gym = new Gym();
      trainer.person = person;

      trainer.managerId = 1;
      trainer.workerCode = 'some-uuid';
      trainer.events = [];

      const result = await TrainerDTO.fromClass(trainer, new Gym());

      expect(result.id).toBe(trainer.person.id);
      expect(result.email).toBe(trainer.person.email);
      expect(result.password).toBe(trainer.person.password);
      expect(result.firstName).toBe(trainer.person.firstName);
      expect(result.lastName).toBe(trainer.person.lastName);
      expect(result.theme).toBe(trainer.person.theme);
      expect(result.gender).toBe(trainer.person.gender);
      expect(result.gym).toStrictEqual(trainer.person.gym);
      // Trainer props
      expect(result.managerId).toBe(trainer.managerId);
      expect(result.workerCode).toBe(trainer.workerCode);
      expect(result.events).toBe(trainer.events);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating an TrainerDTO<Gym> from an incorrect Trainer', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await TrainerDTO.fromClass({ person: {} } as any, {} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return a trainer', async () => {
      // Set up class
      const dto = new TrainerDTO();
      dto.id = 1;
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;
      dto.theme = AppTheme.LIGHT;
      dto.managerId = 1;
      dto.workerCode = 'some-uuid';
      dto.events = [];

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.managerId).toBe(dto.managerId);
      expect(result.workerCode).toBe(dto.workerCode);
      expect(result.events).toBe(dto.events);

      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
