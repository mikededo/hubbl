import { getRepository } from 'typeorm';
import * as log from 'npmlog';

import { ClientDTO } from '@hubbl/shared/models/dto';

import {
  ClientService,
  GymService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../services';
import * as helpers from '../helpers';
import {
  ClientLoginController,
  ClientRegisterController,
  ClientUpdateController
} from './Client.controller';
import * as personHelpers from './helpers';
import { ClientFetchController } from '.';
import { nanoid } from 'nanoid';

jest.mock('../../services');
jest.mock('./helpers');
jest.mock('../helpers');
jest.mock('npmlog');

describe('ClientController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ClientFetch', () => {
    const mockReq = { query: { skip: 0 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };

    const mockPersonService = { findOne: jest.fn() };

    const logSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('execute', () => {
      const setupServices = () => {
        ClientFetchController['service'] = {} as any;
        ClientFetchController['personService'] = mockPersonService as any;
      };

      it('should create the needed services if does not have any', async () => {
        ClientFetchController['service'] = undefined;
        ClientFetchController['personService'] = undefined;

        jest.spyOn(ClientFetchController, 'fail').mockImplementation();

        await ClientFetchController.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
        expect(PersonService).toHaveBeenCalledTimes(1);
        expect(PersonService).toHaveBeenCalledWith(getRepository);
      });

      it('should call fetch', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await ClientFetchController.execute(mockReq as any, mockRes as any);

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(mockPersonService.findOne).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: ClientFetchController,
          res: mockRes,
          fromClass: ClientDTO.fromClass,
          gymId: 1,
          alias: 'c',
          personFk: 'client_person_fk',
          skip: mockReq.query.skip
        });
      });

      it('should use skip as 0 if not given', async () => {
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        setupServices();
        await ClientFetchController.execute(
          { query: {} } as any,
          mockRes as any
        );

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledTimes(1);
        expect(personHelpers.fetch).toHaveBeenCalledWith({
          service: {},
          controller: ClientFetchController,
          res: mockRes,
          fromClass: ClientDTO.fromClass,
          gymId: 1,
          alias: 'c',
          personFk: 'client_person_fk',
          skip: 0
        });
      });

      it('should call forbidden if person is not owner nor worker', async () => {
        const mockRes = {
          locals: { token: { id: 1, user: 'client' } }
        } as any;
        const forbiddenSpy = jest
          .spyOn(ClientFetchController, 'forbidden')
          .mockImplementation();

        setupServices();
        await ClientFetchController.execute(mockReq as any, mockRes as any);

        expect(forbiddenSpy).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledWith(
          mockRes,
          'User can not fetch the clients.'
        );
      });

      it('should call forbidden if person does not exist', async () => {
        mockPersonService.findOne.mockResolvedValue(undefined);
        const unauthorizedSpy = jest
          .spyOn(ClientFetchController, 'unauthorized')
          .mockImplementation();

        setupServices();
        await ClientFetchController.execute(mockReq as any, mockRes as any);

        expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledWith(
          mockRes,
          'Person does not exist'
        );
      });

      it('should call fail on personService error', async () => {
        mockPersonService.findOne.mockRejectedValue('error-thrown');
        const failSpy = jest
          .spyOn(ClientFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await ClientFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${ClientFetchController.constructor.name}]`,
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
          .spyOn(ClientFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await ClientFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${ClientFetchController.constructor.name}]`,
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

  describe('ClientRegisterController', () => {
    const mockEmptyReq = { query: {} } as any;
    const mockReq = { query: { code: nanoid(8) }, body: {} } as any;
    const mockGymService = { findOne: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      ClientRegisterController['service'] = {} as any;
      ClientRegisterController['gymService'] = mockGymService as any;
    };

    describe('execute', () => {
      it('should create a service if does not have any', async () => {
        ClientRegisterController['service'] = undefined;
        ClientRegisterController['gymService'] = undefined;

        jest.spyOn(ClientRegisterController, 'fail').mockImplementation();

        await ClientRegisterController.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
        expect(GymService).toHaveBeenCalledTimes(1);
        expect(GymService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register if no code given', async () => {
        const registerSpy = jest
          .spyOn(personHelpers, 'register')
          .mockImplementation();

        mockGymService.findOne.mockResolvedValue({ id: 1 });

        setupServices();
        await ClientRegisterController.execute(mockEmptyReq, {} as any);

        expect(mockGymService.findOne).not.toHaveBeenCalled();

        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: ClientRegisterController,
          fromJson: ClientDTO.fromJson,
          fromClass: ClientDTO.fromClass,
          req: mockEmptyReq,
          res: {},
          alias: 'client'
        });
      });

      it('should call register after fetching the gym with the given code', async () => {
        const registerSpy = jest
          .spyOn(personHelpers, 'register')
          .mockImplementation();

        mockGymService.findOne.mockResolvedValue({ id: 1 });

        setupServices();
        await ClientRegisterController.execute(mockReq, {} as any);

        expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
        expect(mockGymService.findOne).toHaveBeenCalledWith({
          options: {
            where: { code: mockReq.query.code },
            select: ['id'],
            loadEagerRelations: false
          }
        });
        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: ClientRegisterController,
          fromJson: ClientDTO.fromJson,
          fromClass: ClientDTO.fromClass,
          req: { ...mockReq, body: { gym: 1 } },
          res: {},
          alias: 'client'
        });
      });

      it('should call unauthorized if gym does not exist', async () => {
        const unauthorizedSpy = jest
          .spyOn(ClientRegisterController, 'unauthorized')
          .mockImplementation();
        mockGymService.findOne.mockResolvedValue(undefined);

        setupServices();
        await ClientRegisterController.execute(mockReq, {} as any);

        expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledWith(
          {},
          'Gym code does not belong to any gym.'
        );
      });

      it('should send fail on gymService error', async () => {
        const failSpy = jest
          .spyOn(ClientRegisterController, 'fail')
          .mockImplementation();
        const logSpy = jest.spyOn(log, 'error').mockImplementation();

        mockGymService.findOne.mockRejectedValue('error-thrown');

        setupServices();
        await ClientRegisterController.execute(mockReq, {} as any);

        expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller[${ClientRegisterController.constructor.name}]`,
          '"register" handler',
          'error-thrown'
        );
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          {},
          'Internal server error. If the error persists, contact our team'
        );
      });
    });
  });

  describe('ClientLoginController', () => {
    describe('execute', () => {
      it('should create a service if does not have any', async () => {
        await ClientLoginController.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
      });

      it('should call clientLogin', async () => {
        const clientLoginSpy = jest
          .spyOn(personHelpers, 'clientLogin')
          .mockImplementation();

        ClientLoginController['service'] = {} as any;
        await ClientLoginController.execute({} as any, {} as any);

        expect(clientLoginSpy).toHaveBeenCalledWith({
          service: {},
          controller: ClientLoginController,
          fromJson: ClientDTO.fromJson,
          fromClass: ClientDTO.fromClass,
          req: {},
          res: {}
        });
      });
    });
  });

  describe('ClientUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        ClientUpdateController['service'] = undefined;
        ClientUpdateController['ownerService'] = undefined;
        ClientUpdateController['workerService'] = undefined;

        await ClientUpdateController.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call clientUpdate', async () => {
        const clientUpdateSpy = jest
          .spyOn(helpers, 'clientUpdate')
          .mockImplementation();

        ClientUpdateController['service'] = {} as any;
        ClientUpdateController['ownerService'] = {} as any;
        ClientUpdateController['workerService'] = {} as any;
        await ClientUpdateController.execute({} as any, {} as any);

        expect(clientUpdateSpy).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: {},
          controller: ClientUpdateController,
          req: {},
          res: {}
        });
      });
    });
  });
});
