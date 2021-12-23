import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import { WorkerService } from '../../services/Person';
import { WorkerRegisterController } from './Worker.controller';
import { WorkerDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Worker.service');
jest.mock('../helpers');

describe('WorkerController', () => {
  describe('WorkerRegister', () => {
    let controller: WorkerRegisterController;

    beforeEach(() => {
      controller = new WorkerRegisterController();
    });

    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await controller.execute({} as any, {} as any);

        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(helpers, 'register')
          .mockImplementation();

        controller['service'] = {} as any;
        await controller.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith(
          {},
          controller,
          WorkerDTO.fromJson,
          WorkerDTO.fromClass,
          {},
          {},
          'worker'
        );
      });
    });
  });
});
