import { getRepository } from 'typeorm';

import { TrainerDTO } from '@gymman/shared/models/dto';

import { OwnerService, TrainerService, WorkerService } from '../../services';
import * as helpers from '../helpers';
import {
  TrainerRegisterController,
  TrainerUpdateController
} from './Trainer.controller';

jest.mock('../../services');
jest.mock('../helpers');

describe('TrainerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TrainerRegister', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await TrainerRegisterController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(helpers, 'register')
          .mockImplementation();

        TrainerRegisterController['service'] = {} as any;
        await TrainerRegisterController.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: TrainerRegisterController,
          fromJson: TrainerDTO.fromJson,
          fromClass: TrainerDTO.fromClass,
          req: {},
          res: {},
          returnName: 'trainer'
        });
      });
    });
  });

  describe('TrainerUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        const mockReq = { query: { by: 'any' } };

        TrainerUpdateController['service'] = undefined;
        TrainerUpdateController['ownerService'] = undefined;
        TrainerUpdateController['workerService'] = undefined;

        await TrainerUpdateController.execute(mockReq as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call trainerUpdate', async () => {
        const mockReq = { query: { by: 'any' } } as any;
        const trainerUpdate = jest
          .spyOn(helpers, 'trainerUpdate')
          .mockImplementation();

        TrainerUpdateController['service'] = {} as any;
        TrainerUpdateController['ownerService'] = {} as any;
        TrainerUpdateController['workerService'] = {} as any;
        await TrainerUpdateController.execute(mockReq as any, {} as any);

        expect(trainerUpdate).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: {},
          controller: TrainerUpdateController,
          req: mockReq,
          res: {},
          by: 'any'
        });
      });
    });
  });
});
