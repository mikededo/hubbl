import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Person, Worker } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import { PersonDTOVariants } from '../Person';
import * as Util from '../util';
import WorkerDTO from './Worker';

describe('WorkerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const workerPropsAssign = (worker: WorkerDTO<Gym | number> | Worker) => {
    worker.workerCode = 'some-uuid';
    worker.managerId = 1;
    worker.updateVirtualGyms = false;
    worker.createGymZones = false;
    worker.updateGymZones = false;
    worker.deleteGymZones = false;
    worker.createTrainers = false;
    worker.updateTrainers = false;
    worker.deleteTrainers = false;
    worker.createEvents = false;
    worker.updateEvents = false;
    worker.deleteEvents = false;
    worker.createEventTypes = false;
    worker.updateEventTypes = false;
    worker.deleteEventTypes = false;
  };

  const workerPropCompare = (want: any, got: any) => {
    expect(got.managerId).toBe(want.managerId);
    expect(got.updateVirtualGyms).toBe(want.updateVirtualGyms);
    expect(got.createGymZones).toBe(want.createGymZones);
    expect(got.updateGymZones).toBe(want.updateGymZones);
    expect(got.deleteGymZones).toBe(want.deleteGymZones);
    expect(got.createTrainers).toBe(want.createTrainers);
    expect(got.updateTrainers).toBe(want.updateTrainers);
    expect(got.deleteTrainers).toBe(want.deleteTrainers);
    expect(got.createEvents).toBe(want.createEvents);
    expect(got.updateEvents).toBe(want.updateEvents);
    expect(got.deleteEvents).toBe(want.deleteEvents);
    expect(got.createEventTypes).toBe(want.createEventTypes);
    expect(got.updateEventTypes).toBe(want.updateEventTypes);
    expect(got.deleteEventTypes).toBe(want.deleteEventTypes);
  };

  describe('#fromJson', () => {
    const successFromJSON = async (
      gym: Gym | number,
      variant: PersonDTOVariants
    ) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        managerId: 1,
        gym,
        gender: Gender.OTHER,
        updateVirtualGyms: false,
        createGymZones: false,
        updateGymZones: false,
        deleteGymZones: false,
        createTrainers: false,
        updateTrainers: false,
        deleteTrainers: false,
        createEvents: false,
        updateEvents: false,
        deleteEvents: false,
        createEventTypes: false,
        updateEventTypes: false,
        deleteEventTypes: false
      };

      const result = await WorkerDTO.fromJson<number>(json, variant);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(WorkerDTO);

      // Check fields
      workerPropCompare(result, json);
      // Additional checks
      expect(result.gym).toBe(gym);

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: [variant]
      });
    };

    const failFromJSON = async (variant: PersonDTOVariants) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await WorkerDTO.fromJson({}, variant);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    };

    it('[register, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(1, PersonDTOVariants.REGISTER);
    });

    it('[login, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(1, PersonDTOVariants.LOGIN);
    });

    it('[register, Gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(new Gym(), PersonDTOVariants.REGISTER);
    });

    it('[login, Gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(new Gym(), PersonDTOVariants.LOGIN);
    });

    it('[register] should fail on an incorrect DTO', async () => {
      await failFromJSON(PersonDTOVariants.REGISTER);
    });

    it('[login] should fail on an incorrect DTO', async () => {
      await failFromJSON(PersonDTOVariants.LOGIN);
    });
  });

  describe('#fromClass', () => {
    it('should create an WorkerDTO<Gym> from a correct Worker', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const password = await hash('testpwd00', await genSalt(10));

      const worker = new Worker();
      const person = new Person();
      person.id = 1;
      person.email = 'test@user.com';
      person.password = password;
      person.firstName = 'Test';
      person.lastName = 'User';
      person.gender = Gender.OTHER;
      person.theme = AppTheme.LIGHT;
      person.gym = new Gym();
      worker.person = person;
      workerPropsAssign(worker);

      const result = await WorkerDTO.fromClass(worker, new Gym());

      workerPropCompare(result, worker);
      expect(result.email).toBe(worker.person.email);
      expect(result.password).toBe(worker.person.password);
      expect(result.firstName).toBe(worker.person.firstName);
      expect(result.lastName).toBe(worker.person.lastName);
      expect(result.gender).toBe(worker.person.gender);

      // Additional checks
      expect(result.gym).toBeInstanceOf(Gym);

      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating an WorkerDTO<Gym> from an incorrect Worker', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await WorkerDTO.fromClass({ person: {} } as any, {} as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return an worker', async () => {
      // Set up class
      const dto = new WorkerDTO();
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;

      workerPropsAssign(dto);

      const result = await dto.toClass();

      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.gender).toBe(dto.gender);
      workerPropCompare(dto, result);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
