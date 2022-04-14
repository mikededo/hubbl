import { OwnerDTO } from '@hubbl/shared/models/dto';

import { OwnerService } from '../../services/Person';
import * as helpers from '../helpers';
import * as personHelpers from './helpers';
import {
  OwnerLoginController,
  OwnerRegisterController,
  OwnerUpdateController
} from './Owner.controller';

jest.mock('../../services/Person/Owner.service');
jest.mock('./helpers');
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
      });

      it('should call register', async () => {
        const registerSpy = jest
          .spyOn(personHelpers, 'register')
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
          alias: 'owner'
        });
      });
    });
  });

  describe('OwnerLoginController', () => {
    describe('execute', () => {
      it('should create a service if does not have any', async () => {
        await OwnerLoginController.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
      });

      it('should call ownerLogin', async () => {
        const ownerLoginSpy = jest
          .spyOn(personHelpers, 'ownerLogin')
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
        OwnerUpdateController['service'] = undefined;

        await OwnerUpdateController.execute({} as any, {} as any);

        expect(OwnerService).toHaveBeenCalledTimes(1);
      });

      it('should call ownerUpdate', async () => {
        const ownerUpdateSpy = jest
          .spyOn(helpers, 'ownerUpdate')
          .mockImplementation();

        OwnerUpdateController['service'] = {} as any;
        await OwnerUpdateController.execute({} as any, {} as any);

        expect(ownerUpdateSpy).toHaveBeenCalledWith({
          service: {},
          controller: OwnerUpdateController,
          req: {},
          res: {}
        });
      });
    });
  });
});
