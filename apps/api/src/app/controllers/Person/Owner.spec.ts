import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import OwnerService from '../../services/Person/Owner.service';
import { OwnerRegisterController } from './Owner.controller';
import { OwnerDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Owner.service');
jest.mock('../helpers');

describe('OwnerController', () => {
  describe('OwnerRegister', () => {
    let controller: OwnerRegisterController;

    beforeEach(() => {
      controller = new OwnerRegisterController();
    });

    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await controller.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
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
          OwnerDTO.fromJson,
          OwnerDTO.fromClass,
          {},
          {}
        );
      });
    });
  });
});
