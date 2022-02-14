import { getRepository } from 'typeorm';

import { WorkerDTO } from '@hubbl/shared/models/dto';
import * as log from 'npmlog';

import { WorkerService, OwnerService, PersonService } from '../../services';
import * as personHelpers from './helpers';
import * as helpers from '../helpers';
import {
  WorkerLoginController,
  WorkerRegisterController,
  WorkerUpdateController,
  WorkerFetchController
} from './Worker.controller';

jest.mock('../../services');
jest.mock('./helpers');
jest.mock('../helpers');

jest.mock('npmlog');

describe('WorkerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WorkerFetch', () => {
    const mockReq = { query: { skip: 0 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };

    const mockPersonService = { findOne: jest.fn() };

    const logSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('execute', () => {
      const setupServices = () => {
        WorkerFetchController['service'] = {} as any;
        WorkerFetchController['personService'] = mockPersonService as any;
      };

      it('should create the needed services if does not have any', async () => {
        WorkerFetchController['service'] = undefined;
        WorkerFetchController['personService'] = undefined;

        jest.spyOn(WorkerFetchController, 'fail').mockImplementation();

        await WorkerFetchController.execute({} as any, {} as any);

        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
        expect(PersonService).toHaveBeenCalledTimes(1);
        expect(PersonService).toHaveBeenCalledWith(getRepository);
      });

      it('should call fetch', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await WorkerFetchController.execute(mockReq as any, mockRes as any);

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(mockPersonService.findOne).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: WorkerFetchController,
          res: mockRes,
          fromClass: WorkerDTO.fromClass,
          gymId: 1,
          alias: 'w',
          personFk: 'worker_person_fk',
          skip: mockReq.query.skip
        });
      });

      it('should use skip as 0 if not given', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await WorkerFetchController.execute(
          { query: {} } as any,
          mockRes as any
        );

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: WorkerFetchController,
          res: mockRes,
          fromClass: WorkerDTO.fromClass,
          gymId: 1,
          alias: 'w',
          personFk: 'worker_person_fk',
          skip: 0
        });
      });

      it('should call forbidden if person is not owner nor worker', async () => {
        const mockRes = {
          locals: { token: { id: 1, user: 'client' } }
        } as any;
        const forbiddenSpy = jest
          .spyOn(WorkerFetchController, 'forbidden')
          .mockImplementation();

        setupServices();
        await WorkerFetchController.execute(mockReq as any, mockRes as any);

        expect(forbiddenSpy).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledWith(
          mockRes,
          'User can not fetch the workers.'
        );
      });

      it('should call forbidden if person does not exist', async () => {
        mockPersonService.findOne.mockResolvedValue(undefined);
        const unauthorizedSpy = jest
          .spyOn(WorkerFetchController, 'unauthorized')
          .mockImplementation();

        setupServices();
        await WorkerFetchController.execute(mockReq as any, mockRes as any);

        expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledWith(
          mockRes,
          'Person does not exist'
        );
      });

      it('should call fail on personService error', async () => {
        mockPersonService.findOne.mockRejectedValue('error-thrown');
        const failSpy = jest
          .spyOn(WorkerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await WorkerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${WorkerFetchController.constructor.name}]`,
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
          .spyOn(WorkerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await WorkerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${WorkerFetchController.constructor.name}]`,
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

  describe('WorkerRegisterController', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await WorkerRegisterController.execute({} as any, {} as any);

        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(personHelpers, 'register')
          .mockImplementation();

        WorkerRegisterController['service'] = {} as any;
        await WorkerRegisterController.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: WorkerRegisterController,
          fromJson: WorkerDTO.fromJson,
          fromClass: WorkerDTO.fromClass,
          req: {},
          res: {},
          alias: 'worker'
        });
      });
    });
  });

  describe('WorkerLoginController', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await WorkerLoginController.execute({} as any, {} as any);

        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call workerLogin', async () => {
        const workerLoginSpy = jest
          .spyOn(personHelpers, 'workerLogin')
          .mockImplementation();

        WorkerLoginController['service'] = {} as any;
        await WorkerLoginController.execute({} as any, {} as any);

        expect(workerLoginSpy).toHaveBeenCalledWith({
          service: {},
          controller: WorkerLoginController,
          fromJson: WorkerDTO.fromJson,
          fromClass: WorkerDTO.fromClass,
          req: {},
          res: {}
        });
      });
    });
  });

  describe('WorkerUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        WorkerUpdateController['service'] = undefined;
        WorkerUpdateController['ownerService'] = undefined;

        await WorkerUpdateController.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call workerUpdate', async () => {
        const workerUpdateSpy = jest
          .spyOn(helpers, 'workerUpdate')
          .mockImplementation();

        WorkerUpdateController['service'] = {} as any;
        WorkerUpdateController['ownerService'] = {} as any;
        WorkerUpdateController['workerService'] = {} as any;
        await WorkerUpdateController.execute({} as any, {} as any);

        expect(workerUpdateSpy).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          controller: WorkerUpdateController,
          req: {},
          res: {}
        });
      });
    });
  });
});
