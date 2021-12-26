import * as jwt from 'jsonwebtoken';

import auth from './auth.middleware';

describe('Authorization middleware', () => {
  const token = jwt.sign(
    { id: 1, email: 'test@auth.com' },
    process.env.NX_JWT_TOKEN || 'test-secret-key',
    { expiresIn: '10m' }
  );

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if token validation is correct', () => {
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const decodeSpy = jest.spyOn(jwt, 'decode');
    const mockNext = jest.fn();

    auth(mockReq as any, mockRes as any, mockNext);

    expect(decodeSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledWith(token);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should send a 401 code with a message if no auth', () => {
    const mockReq = { headers: {} };

    auth(mockReq as any, mockRes as any, undefined);

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Unauthorized. Token should be provided.'
    });
  });

  it('should send a 401 code with a message token not Bearer', () => {
    const mockReq = { headers: { authorization: 'Any token' } };

    auth(mockReq as any, mockRes as any, undefined);

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Unauthorized. Invalid token type.'
    });
  });

  it('should send a 401 code with a message if token expired', () => {
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const decodeSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ exp: 0 });

    auth(mockReq as any, mockRes as any, undefined);

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(decodeSpy).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: 'Unauthorized. Token expired.'
    });
  });
});
