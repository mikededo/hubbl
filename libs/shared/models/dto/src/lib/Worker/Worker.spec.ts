import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Worker } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import GymDTO from '../Gym';
import * as Util from '../util';
import WorkerDTO from './Worker';

jest.mock('@hubbl/shared/models/helpers');

const workerPropsAssign = (worker: WorkerDTO<Gym | number> | Worker) => {
  worker.updateVirtualGyms = false;
  worker.createGymZones = false;
  worker.updateGymZones = false;
  worker.deleteGymZones = false;
  worker.createTrainers = false;
  worker.updateTrainers = false;
  worker.deleteTrainers = false;
  worker.createClients = false;
  worker.updateClients = false;
  worker.deleteClients = false;
  worker.createTags = false;
  worker.updateTags = false;
  worker.deleteTags = false;
  worker.createEvents = false;
  worker.updateEvents = false;
  worker.deleteEvents = false;
  worker.createEventTypes = false;
  worker.updateEventTypes = false;
  worker.deleteEventTypes = false;
  worker.createEventTemplates = false;
  worker.updateEventTemplates = false;
  worker.deleteEventTemplates = false;
  worker.createEventAppointments = false;
  worker.updateEventAppointments = false;
  worker.deleteEventAppointments = false;
  worker.createCalendarAppointments = false;
  worker.updateCalendarAppointments = false;
  worker.deleteCalendarAppointments = false;
};

const workerPropCompare = (
  want: Worker | WorkerDTO<Gym | number>,
  got: Worker | WorkerDTO<Gym | number>
) => {
  expect(got.updateVirtualGyms).toBe(want.updateVirtualGyms);
  expect(got.createGymZones).toBe(want.createGymZones);
  expect(got.updateGymZones).toBe(want.updateGymZones);
  expect(got.deleteGymZones).toBe(want.deleteGymZones);
  expect(got.createTrainers).toBe(want.createTrainers);
  expect(got.updateTrainers).toBe(want.updateTrainers);
  expect(got.deleteTrainers).toBe(want.deleteTrainers);
  expect(got.createClients).toBe(want.createClients);
  expect(got.updateClients).toBe(want.updateClients);
  expect(got.deleteClients).toBe(want.deleteClients);
  expect(got.createTags).toBe(want.createClients);
  expect(got.updateTags).toBe(want.updateClients);
  expect(got.deleteTags).toBe(want.deleteClients);
  expect(got.createEvents).toBe(want.createEvents);
  expect(got.updateEvents).toBe(want.updateEvents);
  expect(got.deleteEvents).toBe(want.deleteEvents);
  expect(got.createEventTypes).toBe(want.createEventTypes);
  expect(got.updateEventTypes).toBe(want.updateEventTypes);
  expect(got.deleteEventTypes).toBe(want.deleteEventTypes);
  expect(got.createEventTemplates).toBe(want.createEventTemplates);
  expect(got.updateEventTemplates).toBe(want.updateEventTemplates);
  expect(got.deleteEventTemplates).toBe(want.deleteEventTemplates);
  expect(got.createEventAppointments).toBe(want.createEventAppointments);
  expect(got.updateEventAppointments).toBe(want.updateEventAppointments);
  expect(got.deleteEventAppointments).toBe(want.deleteEventAppointments);
  expect(got.createCalendarAppointments).toBe(want.createCalendarAppointments);
  expect(got.updateCalendarAppointments).toBe(want.updateCalendarAppointments);
  expect(got.deleteCalendarAppointments).toBe(want.deleteCalendarAppointments);
};

describe('WorkerDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJson', () => {
    it('should create a DTO if json is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = Util.createPersonJson({
        gym: 1,
        updateVirtualGyms: false,
        createGymZones: false,
        updateGymZones: false,
        deleteGymZones: false,
        createTrainers: false,
        updateTrainers: false,
        deleteTrainers: false,
        createClients: false,
        updateClients: false,
        deleteClients: false,
        createTags: false,
        updateTags: false,
        deleteTags: false,
        createEvents: false,
        updateEvents: false,
        deleteEvents: false,
        createEventTypes: false,
        updateEventTypes: false,
        deleteEventTypes: false,
        createEventTemplates: false,
        updateEventTemplates: false,
        deleteEventTemplates: false,
        createEventAppointments: false,
        updateEventAppointments: false,
        deleteEventAppointments: false,
        createCalendarAppointments: false,
        updateCalendarAppointments: false,
        deleteCalendarAppointments: false
      });

      const result = await WorkerDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(WorkerDTO);

      // Check fields
      workerPropCompare(result, json);
      // Additional checks
      expect(result.gym).toBe(json.gym);

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any' as any]
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
        await WorkerDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create an WorkerDTO from a correct Worker', async () => {
      const password = await hash('testpwd00', await genSalt(10));

      const worker = new Worker();

      worker.person = Util.createPerson(password);
      workerPropsAssign(worker);

      const gymFromClassSpy = jest.spyOn(GymDTO, 'fromClass').mockReturnValue({
        ...(worker.person.gym as Gym),
        toClass: jest.fn().mockReturnValue(worker.person.gym)
      });

      const result = WorkerDTO.fromClass(worker);

      expect(gymFromClassSpy).toHaveBeenCalledTimes(1);
      expect(gymFromClassSpy).toHaveBeenCalledWith(worker.person.gym);
      workerPropCompare(result, worker);
      expect(result.email).toBe(worker.person.email);
      expect(result.password).toBe(worker.person.password);
      expect(result.firstName).toBe(worker.person.firstName);
      expect(result.lastName).toBe(worker.person.lastName);
      expect(result.gender).toBe(worker.person.gender);

      // Additional checks
      expect(result.gym).toBeInstanceOf(Gym);
    });
  });

  describe('#toClass', () => {
    it('should return an worker', async () => {
      // Set up class
      const dto = Util.createPersonDTO<WorkerDTO<Gym | number>>(WorkerDTO);

      workerPropsAssign(dto);

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.person.theme).toBe(dto.theme);
      workerPropCompare(dto, result);
      expect(result.personId).toBe(dto.id);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
