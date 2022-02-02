import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/GymZone';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('GymZone routes', () => {
  it('should call GymZoneFetchController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.GymZoneFetchController,
      'execute'
    );

    await supertest(app).get('/virtual-gyms/1/gym-zones');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call GymZoneCreateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.GymZoneCreateController,
      'execute'
    );

    await supertest(app).post('/virtual-gyms/1/gym-zones');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call GymZoneUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.GymZoneUpdateController,
      'execute'
    );

    await supertest(app).put('/virtual-gyms/1/gym-zones');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call GymZoneDeleteController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.GymZoneDeleteController,
      'execute'
    );

    await supertest(app).delete('/virtual-gyms/1/gym-zones/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
