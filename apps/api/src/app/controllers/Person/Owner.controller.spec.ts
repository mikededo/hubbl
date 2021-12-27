import { getRepository } from 'typeorm';

import * as helpers from '../helpers';

import { OwnerService } from '../../services/Person';
import {
  OwnerLoginController,
  OwnerRegisterController,
  OwnerUpdateController
} from './Owner.controller';
import { OwnerDTO } from '@gymman/shared/models/dto';

jest.mock('../../services/Person/Owner.service');
jest.mock('../helpers');

describe('OwnerControllerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OwnerRegister', () => {
    describe('execute', () => {
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

        expect(registerSpy).toHaveBeenCalledWith({
          service: {},
          controller: OwnerRegisterController,
          fromJson: OwnerDTO.fromJson,
          fromClass: OwnerDTO.fromClass,
          req: {},
          res: {},
          returnName: 'owner'
        });
      });
    });
  });

  describe('OwnerLoginController', () => {
    describe('execute', () => {
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

        expect(ownerLoginSpy).toHaveBeenCalledWith({
          service: {},
          controller: OwnerLoginController,
          fromJson: OwnerDTO.fromJson,
          fromClass: OwnerDTO.fromClass,
          req: {},
          res: {}
        });
      });
    });
  });

  describe('OwnerUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        const mockReq = { query: { by: 'any' } };

        OwnerUpdateController['service'] = undefined;

        await OwnerUpdateController.execute(mockReq as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call ownerUpdate', async () => {
        const mockReq = { query: { by: 'any' } } as any;
        const ownerUpdateSpy = jest
          .spyOn(helpers, 'ownerUpdate')
          .mockImplementation();

        OwnerUpdateController['service'] = {} as any;
        await OwnerUpdateController.execute(mockReq as any, {} as any);

        expect(ownerUpdateSpy).toHaveBeenCalledWith({
          service: {},
          controller: OwnerUpdateController,
          req: mockReq,
          res: {}
        });
      });
    });
  });
});
