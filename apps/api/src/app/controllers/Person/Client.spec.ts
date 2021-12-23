import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import { ClientService } from '../../services/Person';
import { ClientRegisterController } from './Client.controller';
import { ClientDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Client.service');
jest.mock('../helpers');

describe('ClientController', () => {
  describe('ClientRegister', () => {
    let controller: ClientRegisterController;

    beforeEach(() => {
      controller = new ClientRegisterController();
    });

    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await controller.execute({} as any, {} as any);

        expect(ClientService).toHaveBeenCalledTimes(1);
        expect(ClientService).toHaveBeenCalledWith(getRepository);
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
          ClientDTO.fromJson,
          ClientDTO.fromClass,
          {},
          {},
          'client'
        );
      });
    });
  });
});
