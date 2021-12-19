import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { RegisterOwnerDTO } from '@gymman/shared/models/dto';

import OwnerService from '../../services/Person/Owner.service';
import BaseController from '../Base';
import { OwnerRegisterController } from './Owner.controller';

jest.mock('../../services/Person/Owner.service');

describe('OwnerController', () => {
  describe('OwnerRegister', () => {
    describe('run', () => {
      let controller: OwnerRegisterController;

      const mockReq = { body: {} } as any;
      const mockOwner = {
        person: {
          id: 1,
          email: 'test@user.com',
          password: '123456'
        }
      } as any;
      const mockOwnerDTO = {
        ...mockOwner.person,
        toClass: jest.fn().mockResolvedValue
      } as any;
      const token = jwt.sign(
        { id: 1, email: 'test@user.com' },
        process.env.JWT_TOKEN || 'secret-token'
      );

      beforeEach(() => {
        jest.clearAllMocks();
        controller = new OwnerRegisterController();
      });

      it('should create a new OwnerService if does not have any', async () => {
        try {
          await controller.execute({} as any, {} as any);
        } catch (_) {
          // Nothing
        }

        expect(OwnerService).toHaveBeenCalled();
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
      });

      it('should save the owner and call created with the token and the owner', async () => {
        const mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis(),
          setHeader: jest.fn()
        } as any;
        const mockService = {
          save: jest.fn().mockResolvedValue(mockOwner)
        } as any;

        // Inject deps using reflection
        controller['service'] = mockService;
        // Set up spies
        const fromJSONSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromJson')
          .mockResolvedValue(mockOwnerDTO);
        const fromClassSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromClass')
          .mockResolvedValue(mockOwner);
        const jwtSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);
        const createdSpy = jest
          .spyOn(controller, 'created')
          .mockReturnValue({} as any);

        // execute spy to check if returns
        const executeSpy = jest.spyOn(controller, 'execute');

        await controller.execute(mockReq, mockRes);

        // Check spies
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledWith(mockRes, {
          token,
          owner: expect.anything()
        });
        expect(fromJSONSpy).toHaveBeenCalledWith({}, 'register');
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledWith(mockOwner);
        expect(jwtSpy).toHaveBeenCalledTimes(1);
        expect(jwtSpy).toHaveBeenCalledWith(
          { id: 1, email: 'test@user.com' },
          process.env.JWT_TOKEN || 'secret-token'
        );
        // Ensure cookie is set
        expect(mockRes.setHeader).toBeCalledWith(
          'Set-Cookie',
          `__gym-man-refresh__=${token}; HttpOnly`
        );
        // Check result
        expect(executeSpy).toHaveReturned();
      });

      it('should thow a 400 on validate fromJSON error', async () => {
        const fromJSONSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromJson')
          .mockRejectedValueOnce('error-thrown');
        const mockService = { save: jest.fn() } as any;
        const jsonResSpy = jest
          .spyOn(BaseController, 'jsonResponse')
          .mockImplementation();

        controller['service'] = mockService;

        await controller.execute(mockReq, {} as any);

        expect(fromJSONSpy).toHaveBeenCalledTimes(1);
        expect(jsonResSpy).toHaveBeenCalledTimes(1);
        expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
      });

      it('should send a fail on service error', async () => {
        const fromJSONSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromJson')
          .mockResolvedValue(mockOwnerDTO);
        const mockService = {
          save: jest.fn().mockRejectedValue(mockOwner)
        } as any;
        const failSpy = jest.spyOn(controller, 'fail').mockImplementation();

        controller['service'] = mockService;
        await controller.execute(mockReq, {} as any);

        expect(fromJSONSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          {} as any,
          'Internal server error. If the error persists, contact our team.'
        );
      });

      it('should send a fail if JWT_TOKEN not set', async () => {
        // Clear the JWT_SECRET value
        process.env.JWT_TOKEN = undefined;

        const fromJSONSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromJson')
          .mockResolvedValue(mockOwnerDTO);
        const mockService = {
          save: jest.fn().mockRejectedValue(mockOwner)
        } as any;
        const failSpy = jest.spyOn(controller, 'fail').mockImplementation();

        controller['service'] = mockService;
        await controller.execute(mockReq, {} as any);

        expect(fromJSONSpy).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          {} as any,
          'Internal server error. If the error persists, contact our team.'
        );
      });

      it('should send a fail on created error', async () => {
        const mockRes = { setHeader: jest.fn() } as any;
        const fromJSONSpy = jest
          .spyOn(RegisterOwnerDTO, 'fromJson')
          .mockResolvedValue(mockOwnerDTO);
        const mockService = {
          save: jest.fn().mockResolvedValue(mockOwner)
        } as any;
        const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);
        const failSpy = jest.spyOn(controller, 'fail').mockImplementation();

        jest.spyOn(controller, 'created').mockImplementation(() => {
          throw new Error();
        });

        controller['service'] = mockService;
        await controller.execute(mockReq, mockRes);

        expect(fromJSONSpy).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(signSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledTimes(1);
        // Ensure cookie is set
        expect(mockRes.setHeader).toBeCalledWith(
          'Set-Cookie',
          `__gym-man-refresh__=${token}; HttpOnly`
        );
        // Then failg
        expect(failSpy).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the error persists, contact our team.'
        );
      });
    });
  });
});
