import { getRepository } from 'typeorm';

import { WorkerDTO } from '@gymman/shared/models/dto';

import { WorkerService } from '../../services/Person';
import * as helpers from '../helpers';
import {
  WorkerLoginController,
  WorkerRegisterController
} from './Worker.controller';

jest.mock('../../services/Person/Worker.service');
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
          .spyOn(helpers, 'register')
          .mockImplementation();

        WorkerRegisterController['service'] = {} as any;
        await WorkerRegisterController.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith(
          {},
          WorkerRegisterController,
          WorkerDTO.fromJson,
          WorkerDTO.fromClass,
          {},
          {},
          'worker'
        );
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
          .spyOn(helpers, 'workerLogin')
          .mockImplementation();

        WorkerLoginController['service'] = {} as any;
        await WorkerLoginController.execute({} as any, {} as any);

        expect(workerLoginSpy).toHaveBeenCalledWith(
          {},
          WorkerLoginController,
          WorkerDTO.fromJson,
          WorkerDTO.fromClass,
          {},
          {}
        );
      });
    });
  });
});
