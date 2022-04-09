import * as jwt from 'jsonwebtoken';

import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { ParsedToken } from '@hubbl/shared/types';

import { getRepository } from '../../../config';
import { ClientService, OwnerService, WorkerService } from '../../services';
import { TokenRefresh, TokenValidateCookie } from './Token.controller';

jest.mock('../../services');
jest.mock('npmlog');

describe('Token controller', () => {
  const mockPayload: ParsedToken = {
    id: 1,
    user: 'owner',
    email: 'test@email.com'
  };

  const signSpy = jest.spyOn(jwt, 'sign');
  const verifySpy = jest.spyOn(jwt, 'verify');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TokenValidateCookie', () => {
    const mockReq = {
      cookies: {
        '__hubbl-refresh__': jwt.sign(
          { id: 1, email: 'test@email.com', user: 'owner' },
          process.env.NX_JWT_TOKEN || 'super-secret-key'
        )
      }
    };

    beforeEach(() => {
      mockPayload.user = 'owner';
    });

    const successExecute = async (by: 'owner' | 'worker' | 'client') => {
      const mockService = { findOneBy: jest.fn().mockResolvedValue({ id: 1 }) };
      const fromClassSpy = jest
        .spyOn(
          by === 'owner' ? OwnerDTO : by === 'worker' ? WorkerDTO : ClientDTO,
          'fromClass'
        )
        .mockReturnValue({ id: 1 } as any);
      mockPayload.user = by;

      verifySpy.mockReturnValue(mockPayload as any);
      signSpy.mockReturnValue(mockReq.cookies['__hubbl-refresh__'] as any);

      TokenValidateCookie['ownerService'] =
        by === 'owner' ? mockService : (undefined as any);
      TokenValidateCookie['workerService'] =
        by === 'worker' ? mockService : (undefined as any);
      TokenValidateCookie['clientService'] =
        by === 'client' ? mockService : (undefined as any);

      const okSpy = jest.spyOn(TokenValidateCookie, 'ok').mockImplementation();

      await TokenValidateCookie.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith(
        mockReq.cookies['__hubbl-refresh__'],
        process.env.NX_JWT_TOKEN
      );
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith(
        mockPayload,
        process.env.NX_JWT_TOKEN
      );
      expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockService.findOneBy).toHaveBeenCalledWith({
        personId: mockPayload.id
      });
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(
        {},
        { token: mockReq.cookies['__hubbl-refresh__'], user: { id: 1 } }
      );
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TokenValidateCookie, 'fail').mockImplementation();

      TokenValidateCookie['ownerService'] = undefined;
      TokenValidateCookie['workerService'] = undefined;
      TokenValidateCookie['clientService'] = undefined;

      TokenValidateCookie.execute({} as any, {} as any);

      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
      expect(ClientService).toHaveBeenCalledTimes(1);
      expect(ClientService).toHaveBeenCalledWith(getRepository);
    });

    it('should return a new token and the owner user', async () => {
      await successExecute('owner');
    });

    it('should return a new token and the worker user', async () => {
      await successExecute('worker');
    });

    it('should return a new token and the client user', async () => {
      await successExecute('client');
    });

    it('should send clientError if cookie does not exist', async () => {
      const clientErrorSpy = jest
        .spyOn(TokenValidateCookie, 'clientError')
        .mockImplementation();

      await TokenValidateCookie.execute({ cookies: {} } as any, {} as any);

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith({}, 'Invalid refresh token.');
    });

    it('should send forbidden if token is expired', async () => {
      const forbiddenSpy = jest
        .spyOn(TokenValidateCookie, 'forbidden')
        .mockImplementation();

      verifySpy.mockImplementation(() => {
        throw 'Session expired.';
      });

      await TokenValidateCookie.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith({}, 'Session expired.');
    });

    it('should send forbidden if user not found', async () => {
      const findOneBySpy = jest.fn().mockResolvedValue(undefined);
      verifySpy.mockReturnValue(mockPayload as any);

      const forbiddenSpy = jest
        .spyOn(TokenValidateCookie, 'forbidden')
        .mockImplementation();

      TokenValidateCookie['ownerService'] = { findOneBy: findOneBySpy } as any;
      await TokenValidateCookie.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(findOneBySpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith({}, 'User not found.');
    });

    it('should send fail on service error', async () => {
      const findOneBySpy = jest.fn().mockRejectedValue('error-thrown');
      verifySpy.mockReturnValue(mockPayload as any);

      const failSpy = jest
        .spyOn(TokenValidateCookie, 'fail')
        .mockImplementation();

      TokenValidateCookie['ownerService'] = { findOneBy: findOneBySpy } as any;
      await TokenValidateCookie.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(findOneBySpy).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('TokenRefresh', () => {
    const mockReq = {
      body: {
        token: jwt.sign(
          { id: 1, email: 'test@email.com', user: 'owner' },
          process.env.NX_JWT_TOKEN || 'super-secret-key'
        )
      }
    };

    it('should return a new token', async () => {
      verifySpy.mockReturnValue(mockPayload as any);
      signSpy.mockReturnValue(mockReq.body.token as any);
      const okSpy = jest.spyOn(TokenRefresh, 'ok').mockImplementation();

      await TokenRefresh.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith(
        mockReq.body.token,
        process.env.NX_JWT_TOKEN
      );
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith(
        mockPayload,
        process.env.NX_JWT_TOKEN
      );
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith({}, { token: mockReq.body.token });
    });

    it('should send clientError if no token given', async () => {
      const clientErrorSpy = jest
        .spyOn(TokenRefresh, 'clientError')
        .mockImplementation();

      await TokenRefresh.execute({ body: {} } as any, {} as any);

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        {},
        'Old token not provided.'
      );
    });

    it('should send forbidden if token expired', async () => {
      const forbiddenSpy = jest
        .spyOn(TokenRefresh, 'forbidden')
        .mockImplementation();

      verifySpy.mockImplementation(() => {
        throw 'Token expired';
      });

      await TokenRefresh.execute(mockReq as any, {} as any);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith({}, 'Old token is expired.');
    });
  });
});
