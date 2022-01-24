import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Token';

jest.mock('npmlog');

describe('Token routes', () => {
  describe('Token validation', () => {
    it('should call TokenValidationCookie.execute', async () => {
      const executeSpy = jest.spyOn(controllers.TokenValidateCookie, 'execute');

      await supertest(app).post('/tokens/validate');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Token refresh', () => {
    it('should call TokenRefresh.execute', async () => {
      const executeSpy = jest.spyOn(controllers.TokenRefresh, 'execute');

      await supertest(app).post('/tokens/refresh');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
