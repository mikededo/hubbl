import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import { TrainerService } from '../../services/Person';
import { TrainerRegisterController } from './Trainer.controller';
import { TrainerDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Trainer.service');
jest.mock('../helpers');

describe('TrainerController', () => {
  describe('TrainerRegister', () => {
    let controller: TrainerRegisterController;

    beforeEach(() => {
      controller = new TrainerRegisterController();
    });

    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await controller.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
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
          TrainerDTO.fromJson,
          TrainerDTO.fromClass,
          {},
          {}
        );
      });
    });
  });
});
