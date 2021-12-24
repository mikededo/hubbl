import { getRepository } from 'typeorm';

import { ClientDTO } from '@gymman/shared/models/dto';

import { ClientService } from '../../services/Person';
import * as helpers from '../helpers';
import {
  ClientLoginController,
  ClientRegisterController
} from './Client.controller';

jest.mock('../../services/Person/Client.service');
jest.mock('../helpers');

describe('ClientController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ClientRegisterController', () => {
    describe('run', () => {
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

        expect(registerSpy).toHaveBeenCalledWith(
          {},
          ClientRegisterController,
          ClientDTO.fromJson,
          ClientDTO.fromClass,
          {},
          {},
          'client'
        );
      });
    });
  });

  describe('ClientLoginController', () => {
    describe('run', () => {
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
});
