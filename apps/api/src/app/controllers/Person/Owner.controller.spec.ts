import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import { OwnerService } from '../../services/Person';
import {
  OwnerLoginController,
  OwnerRegisterController
} from './Owner.controller';
import { OwnerDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Owner.service');
jest.mock('../helpers');

describe('OwnerControllerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OwnerRegister', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await OwnerRegisterController.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(helpers, 'register')
          .mockImplementation();

        OwnerRegisterController['service'] = {} as any;
        await OwnerRegisterController.execute({} as any, {} as any);

        expect(registerSpy).toHaveBeenCalledWith(
          {},
          OwnerRegisterController,
          OwnerDTO.fromJson,
          OwnerDTO.fromClass,
          {},
          {},
          'owner'
        );
      });
    });
  });

  describe('OwnerLoginController', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await OwnerLoginController.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call ownerLogin', async () => {
        const ownerLoginSpy = jest
          .spyOn(helpers, 'ownerLogin')
          .mockImplementation();

        OwnerLoginController['service'] = {} as any;
        await OwnerLoginController.execute({} as any, {} as any);

        expect(ownerLoginSpy).toHaveBeenCalledWith(
          {},
          OwnerLoginController,
          OwnerDTO.fromJson,
          OwnerDTO.fromClass,
          {},
          {}
        );
      });
    });
  });
});
