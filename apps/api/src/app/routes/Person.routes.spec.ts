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
  describe('Register', () => {
    it('should call OwnerRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.OwnerRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/owner');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call WorkerRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/worker');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call TrainerRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/trainer');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call ClientRegisterController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.ClientRegisterController,
        'execute'
      );

      await supertest(app).post('/persons/register/client');

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

  describe('Fetch', () => {
    it('should call TrainerFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerFetchController,
        'execute'
      );

      await supertest(app).get('/persons/trainers');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call WorkerFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.WorkerFetchController,
        'execute'
      );

      await supertest(app).get('/persons/workers');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
