import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Trainer } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import TrainerTagDTO from '../TrainerTag';
import * as Util from '../util';
import TrainerDTO from './Trainer';

jest.mock('@hubbl/shared/models/helpers');

describe('TrainerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    const tagFromJsonSpy = jest.spyOn(TrainerTagDTO, 'fromJson');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the DTO if fromJson is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = Util.createPersonJson();

      const result = await TrainerDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(TrainerDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.phone).toBe(json.phone);
      expect(result.theme).toBe(json.theme);
      expect(result.gender).toBe(json.gender);
      expect(result.gym).toBe(json.gym);
      // Trainer fields
      expect(result.managerId).toBe(json.managerId);
      expect(result.workerCode).toBe(json.workerCode);
      // Tags
      expect(result.tags).toStrictEqual([]);

      // Ensure class is validated
      expect(tagFromJsonSpy).not.toHaveBeenCalled();
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create the DTO if TrainerTags.fromJson is not valid', async () => {
      tagFromJsonSpy.mockRejectedValue({});
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(helpers, 'validationParser').mockReturnValue({});

      expect.assertions(4);

      try {
        await TrainerDTO.fromJson({ tags: [{}] }, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(tagFromJsonSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).not.toHaveBeenCalled();
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });

    it('should not create the DTO if fromJson is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(helpers, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await TrainerDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an TrainerDTO from a correct Trainer', async () => {
      const password = await hash('testpwd00', await genSalt(10));

      const trainer = new Trainer();

      trainer.person = Util.createPerson(password);
      trainer.managerId = 1;
      trainer.workerCode = 'some-uuid';
      trainer.events = [];
      trainer.tags = [];

      const result = TrainerDTO.fromClass(trainer);

      expect(result.id).toBe(trainer.person.id);
      expect(result.email).toBe(trainer.person.email);
      expect(result.password).toBe(trainer.person.password);
      expect(result.firstName).toBe(trainer.person.firstName);
      expect(result.lastName).toBe(trainer.person.lastName);
      expect(result.phone).toBe(trainer.person.phone);
      expect(result.theme).toBe(trainer.person.theme);
      expect(result.gender).toBe(trainer.person.gender);
      expect(result.gym).toStrictEqual(trainer.person.gym);
      // Trainer props
      expect(result.managerId).toBe(trainer.managerId);
      expect(result.workerCode).toBe(trainer.workerCode);
      // Tags
      expect(result.tags).toStrictEqual(trainer.tags);
    });

    it('should call TrainerTags.fromClass if has any', async () => {
      const fromClassSpy = jest.spyOn(TrainerTagDTO, 'fromClass');

      const password = await hash('testpwd00', await genSalt(10));
      const trainer = new Trainer();

      trainer.person = Util.createPerson(password);
      trainer.managerId = 1;
      trainer.workerCode = 'some-uuid';
      trainer.events = [];
      trainer.tags = [{}, {}] as any;

      const result = TrainerDTO.fromClass(trainer);

      // Tags
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(result.tags.length).toEqual(trainer.tags.length);
    });

    it('should return an array of empty tags if undefined', async () => {
      const password = await hash('testpwd00', await genSalt(10));
      const trainer = new Trainer();

      trainer.person = Util.createPerson(password);
      trainer.managerId = 1;
      trainer.workerCode = 'some-uuid';
      trainer.events = [];
      trainer.tags = undefined as any;

      const result = TrainerDTO.fromClass(trainer);

      // Tags
      expect(result.tags).toStrictEqual([]);
    });

    it('should return the info only params if variant is info', async () => {
      const password = await hash('testpwd00', await genSalt(10));

      const trainer = new Trainer();

      trainer.person = Util.createPerson(password);
      trainer.managerId = 1;
      trainer.workerCode = 'some-uuid';
      trainer.events = [];

      const result = TrainerDTO.fromClass(trainer, 'info');

      // Must have fields
      expect(result.id).toBe(trainer.person.id);
      expect(result.firstName).toBe(trainer.person.firstName);
      expect(result.lastName).toBe(trainer.person.lastName);

      expect(result.email).toBeUndefined();
      expect(result.password).toBeUndefined();
      expect(result.theme).toBeUndefined();
      expect(result.gender).toBeUndefined();
      expect(result.gym).toBeUndefined();
      expect(result.managerId).toBeUndefined();
      expect(result.workerCode).toBeUndefined();
    });
  });

  describe('#toClass', () => {
    it('should return a trainer', async () => {
      // Set up class
      const dto = Util.createPersonDTO<TrainerDTO<Gym | number>>(TrainerDTO);

      dto.managerId = 1;
      dto.workerCode = 'some-uuid';

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.phone).toBe(dto.phone);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.managerId).toBe(dto.managerId);
      expect(result.workerCode).toBe(dto.workerCode);

      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
