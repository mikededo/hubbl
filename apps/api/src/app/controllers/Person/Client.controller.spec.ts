import { getRepository } from 'typeorm';

import { ClientDTO } from '@gymman/shared/models/dto';

import { ClientService, OwnerService, WorkerService } from '../../services';
import * as helpers from '../helpers';
import {
  ClientLoginController,
  ClientRegisterController,
  ClientUpdateController
} from './Client.controller';

jest.mock('../../services');
jest.mock('../helpers');

describe('ClientController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ClientRegisterController', () => {
    describe('execute', () => {
      it('should create a service if does not have any', async () => {
        await ClientRegisterController.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(helpers, 'register')
          .mockImplementation();

        ClientRegisterController['service'] = {} as any;
        await ClientRegisterController.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: ClientRegisterController,
          fromJson: ClientDTO.fromJson,
          fromClass: ClientDTO.fromClass,
          req: {},
          res: {},
          returnName: 'client'
        });
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
          .spyOn(helpers, 'clientLogin')
          .mockImplementation();

        ClientLoginController['service'] = {} as any;
        await ClientLoginController.execute({} as any, {} as any);

        expect(clientLoginSpy).toHaveBeenCalledWith(
          {},
          ClientLoginController,
          ClientDTO.fromJson,
          ClientDTO.fromClass,
          {},
          {}
        );
      });
    });
  });

  describe('ClientUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        const mockReq = { query: { by: 'any' } };

        ClientUpdateController['service'] = undefined;
        ClientUpdateController['ownerService'] = undefined;
        ClientUpdateController['workerService'] = undefined;

        await ClientUpdateController.execute(mockReq as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call clientUpdate', async () => {
        const mockReq = { query: { by: 'any' } } as any;
        const clientUpdateSpy = jest
          .spyOn(helpers, 'clientUpdate')
          .mockImplementation();

        ClientUpdateController['service'] = {} as any;
        ClientUpdateController['ownerService'] = {} as any;
        ClientUpdateController['workerService'] = {} as any;
        await ClientUpdateController.execute(mockReq as any, {} as any);

        expect(clientUpdateSpy).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: {},
          controller: ClientUpdateController,
          req: mockReq,
          res: {},
          by: 'any'
        });
      });
    });
  });
});
