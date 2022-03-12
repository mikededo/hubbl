import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Gym';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('GymZone routes', () => {
  it('should call GymUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(controllers.GymUpdateController, 'execute');

    await supertest(app).put('/gyms');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
