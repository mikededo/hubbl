import { getRepository } from 'typeorm';

import { WorkerDTO } from '@hubbl/shared/models/dto';

import { WorkerService, OwnerService } from '../../services';
import * as personHelpers from './helpers';
import * as helpers from '../helpers';
import {
  WorkerLoginController,
  WorkerRegisterController,
  WorkerUpdateController
} from './Worker.controller';

jest.mock('../../services');
jest.mock('./helpers');
jest.mock('../helpers');

describe('WorkerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        const mockReq = { query: { by: 'any' } };

        WorkerUpdateController['service'] = undefined;
        WorkerUpdateController['ownerService'] = undefined;

        await WorkerUpdateController.execute(mockReq as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call workerUpdate', async () => {
        const mockReq = { query: { by: 'any' } } as any;
        const workerUpdateSpy = jest
          .spyOn(helpers, 'workerUpdate')
          .mockImplementation();

        WorkerUpdateController['service'] = {} as any;
        WorkerUpdateController['ownerService'] = {} as any;
        WorkerUpdateController['workerService'] = {} as any;
        await WorkerUpdateController.execute(mockReq as any, {} as any);

        expect(workerUpdateSpy).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          controller: WorkerUpdateController,
          req: mockReq,
          res: {},
          by: 'any'
        });
      });
    });
  });
});
