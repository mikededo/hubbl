import { getRepository } from 'typeorm';

import { TrainerDTO } from '@hubbl/shared/models/dto';

import {
  OwnerService,
  PersonService,
  TrainerService,
  WorkerService
} from '../../services';
import * as helpers from '../helpers';
import * as personHelpers from './helpers';
import * as log from 'npmlog';
import {
  TrainerCreateController,
  TrainerUpdateController,
  TrainerFetchController
} from './Trainer.controller';

jest.mock('../../services');
jest.mock('./helpers');
jest.mock('../helpers');
jest.mock('npmlog');

describe('TrainerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TrainerFetch', () => {
    const mockReq = { query: { skip: 0 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };

    const mockPersonService = { findOne: jest.fn() };

    const logSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('execute', () => {
      const setupServices = () => {
        TrainerFetchController['service'] = {} as any;
        TrainerFetchController['personService'] = mockPersonService as any;
      };

      it('should create the needed services if does not have any', async () => {
        TrainerFetchController['service'] = undefined;
        TrainerFetchController['personService'] = undefined;

        jest.spyOn(TrainerFetchController, 'fail').mockImplementation();

        await TrainerFetchController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
        expect(PersonService).toHaveBeenCalledTimes(1);
        expect(PersonService).toHaveBeenCalledWith(getRepository);
      });

      it('should call fetch', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(mockPersonService.findOne).toHaveBeenCalledWith({
          id: mockRes.locals.token.id,
          options: { select: ['id', 'gym'] }
        });
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: TrainerFetchController,
          res: mockRes,
          fromClass: TrainerDTO.fromClass,
          gymId: 1,
          alias: 't',
          skip: mockReq.query.skip
        });
      });

      it('should use skip as 0 if not given', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await TrainerFetchController.execute(
          { query: {} } as any,
          mockRes as any
        );

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: TrainerFetchController,
          res: mockRes,
          fromClass: TrainerDTO.fromClass,
          gymId: 1,
          alias: 't',
          skip: 0
        });
      });

      it('should call forbidden if person is not owner nor worker', async () => {
        const mockRes = {
          locals: { token: { id: 1, user: 'client' } }
        } as any;
        const forbiddenSpy = jest
          .spyOn(TrainerFetchController, 'forbidden')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(forbiddenSpy).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledWith(
          mockRes,
          'User can not fetch the trainers.'
        );
      });

      it('should call forbidden if person does not exist', async () => {
        mockPersonService.findOne.mockResolvedValue(undefined);
        const unauthorizedSpy = jest
          .spyOn(TrainerFetchController, 'unauthorized')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledWith(
          mockRes,
          'Person does not exist'
        );
      });

      it('should call fail on personService error', async () => {
        mockPersonService.findOne.mockRejectedValue('error-thrown');
        const failSpy = jest
          .spyOn(TrainerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${TrainerFetchController.constructor.name}]`,
          '"fetch" handler',
          'error-thrown'
        );
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the problem persists, contact our team.'
        );
      });

      it('should call fail on fetch error', async () => {
        (personHelpers.fetch as any).mockImplementation(() => {
          throw 'error-thrown';
        });
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });
        const failSpy = jest
          .spyOn(TrainerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${TrainerFetchController.constructor.name}]`,
          '"fetch" handler',
          'error-thrown'
        );
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the problem persists, contact our team.'
        );
      });
    });
  });

  describe('TrainerRegister', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await TrainerCreateController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call trainerRegister', async () => {
        const trainerRegisterSpy = jest
          .spyOn(personHelpers, 'trainerRegister')
          .mockImplementation();

        TrainerCreateController['service'] = {} as any;
        await TrainerCreateController.execute({} as any, {} as any);

        expect(trainerRegisterSpy).toHaveBeenCalledWith({
          service: {},
          controller: TrainerCreateController,
          fromJson: TrainerDTO.fromJson,
          fromClass: TrainerDTO.fromClass,
          req: {},
          res: {}
        });
      });
    });
  });

  describe('TrainerUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        TrainerUpdateController['service'] = undefined;
        TrainerUpdateController['ownerService'] = undefined;
        TrainerUpdateController['workerService'] = undefined;

        await TrainerUpdateController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call trainerUpdate', async () => {
        const trainerUpdate = jest
          .spyOn(helpers, 'trainerUpdate')
          .mockImplementation();

        TrainerUpdateController['service'] = {} as any;
        TrainerUpdateController['ownerService'] = {} as any;
        TrainerUpdateController['workerService'] = {} as any;
        await TrainerUpdateController.execute({} as any, {} as any);

        expect(trainerUpdate).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: {},
          controller: TrainerUpdateController,
          req: {},
          res: {}
        });
      });
    });
  });
});
