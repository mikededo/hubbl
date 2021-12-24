import { getRepository } from 'typeorm';

import { TrainerDTO } from '@gymman/shared/models/dto';

import { TrainerService } from '../../services/Person';
import * as helpers from '../helpers';
import { TrainerRegisterController } from './Trainer.controller';

jest.mock('../../services/Person/Trainer.service');
jest.mock('../helpers');

describe('TrainerController', () => {
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

        expect(registerSpy).toHaveBeenCalledWith(
          {},
          TrainerRegisterController,
          TrainerDTO.fromJson,
          TrainerDTO.fromClass,
          {},
          {},
          'trainer'
        );
      });
    });
  });
});
