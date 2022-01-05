import * as log from 'npmlog';

import { postRequest, preRequest } from './logger.middleware';

describe('Logger middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('preRequest', () => {
    it('should log the incoming request method and url, and call next', () => {
      const mockReq = { method: 'POST', originalUrl: 'some/url/of/the/api' };
      const mockNext = jest.fn().mockImplementation();
      const logSpy = jest.spyOn(log, 'info').mockImplementation();

      preRequest(mockReq as any, {} as any, mockNext as any);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        'Request',
        `[${mockReq.method} ${mockReq.originalUrl}]`
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('postRequest', () => {
    it('should log the post request method, url and statusCode on "finish", and call next', () => {
      let mockResCallback: any;

      const mockReq = { method: 'PUT', originalUrl: 'some/url/of/the/api' };
      const mockRes = {
        statusCode: 201,
        on: jest.fn().mockImplementation((value: string, callback: any) => {
          expect(value).toBe('finish');
          expect(callback).toBeDefined();

          // Capture the callback
          mockResCallback = callback;
        })
      };
      const mockNext = jest.fn().mockImplementation();
      const logSpy = jest.spyOn(log, 'info').mockImplementation();

      postRequest(mockReq as any, mockRes as any, mockNext as any);
      mockResCallback();

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        'Request',
        `[${mockReq.method} ${mockReq.originalUrl}] -> ${mockRes.statusCode}`
      );
      expect(mockRes.on).toHaveBeenCalledTimes(1);
      expect(mockRes.on).toHaveBeenCalledWith('finish', expect.anything());
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
