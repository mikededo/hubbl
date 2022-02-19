import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/TrainerTag';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('TrainerTag routes', () => {
  describe('TrainerTag fetch', () => {
    it('should call TrainerTagFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerTagFetchController,
        'execute'
      );

      await supertest(app).get('/tags/trainer');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('TrainerTag create', () => {
    it('should call TrainerTagCreateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerTagCreateController,
        'execute'
      );

      await supertest(app).post('/tags/trainer');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('TrainerTag update', () => {
    it('should call TrainerTagUpdateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.TrainerTagUpdateController,
        'execute'
      );

      await supertest(app).put('/tags/trainer/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
