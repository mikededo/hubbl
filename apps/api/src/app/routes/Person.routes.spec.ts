import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Person';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('Person routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    it('should call OwnerRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.OwnerRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/owner');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call WorkerCreateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerCreateController,
        'execute'
      );

      await supertest(app).post('/persons/worker');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call TrainerCreateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerCreateController,
        'execute'
      );

      await supertest(app).post('/persons/trainer');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/client');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/client?code=SomECoDe');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Login', () => {
    it('should call OwnerLoginController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.OwnerLoginController,
        'execute'
      );

      await supertest(app).post('/persons/login/owner');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call WorkerLoginController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerLoginController,
        'execute'
      );

      await supertest(app).post('/persons/login/worker');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientLoginController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientLoginController,
        'execute'
      );

      await supertest(app).post('/persons/login/client');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update', () => {
    it('should call OwnerUpdateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.OwnerUpdateController,
        'execute'
      );

      await supertest(app).put('/persons/owner');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call WorkerUpdateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerUpdateController,
        'execute'
      );

      await supertest(app).put('/persons/worker');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call TrainerUpdateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerUpdateController,
        'execute'
      );

      await supertest(app).put('/persons/trainer');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientUpdateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientUpdateController,
        'execute'
      );

      await supertest(app).put('/persons/client');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('LogOut', () => {
    it('should call PersonLogOutController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.PersonLogOutController,
        'execute'
      );

      await supertest(app).post('/persons/logout');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fetch', () => {
    it('should call WorkerFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerFetchController,
        'execute'
      );

      await supertest(app).get('/persons/workers');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientFetchController,
        'execute'
      );

      await supertest(app).get('/persons/clients');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call TrainerFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerFetchController,
        'execute'
      );

      await supertest(app).get('/persons/trainers');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
