import * as jwt from 'jsonwebtoken';
import { ParsedToken } from '../helpers';
import { TokenRefresh, TokenValidateCookie } from './Token.controller';

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

    it('should return a new token', async () => {
      verifySpy.mockReturnValue(mockPayload as any);
      signSpy.mockReturnValue(mockReq.cookies['__hubbl-refresh__'] as any);
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
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(
        {},
        { token: mockReq.cookies['__hubbl-refresh__'] }
      );
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
