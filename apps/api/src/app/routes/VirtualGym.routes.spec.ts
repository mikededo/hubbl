import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/VirtualGym';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('VirtualGym routes', () => {
  it('should call VirtualGymFetchController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.VirtualGymFetchController,
      'execute'
    );

    await supertest(app).get('/virtual-gyms');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call VirtualGymFetchSingleController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.VirtualGymFetchSingleController,
      'execute'
    );

    await supertest(app).get('/virtual-gyms/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call VirtualGymCreateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.VirtualGymCreateController,
      'execute'
    );

    await supertest(app).post('/virtual-gyms');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call VirtualGymUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.VirtualGymUpdateController,
      'execute'
    );

    await supertest(app).put('/virtual-gyms');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call VirtualGymDeleteController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.VirtualGymDeleteController,
      'execute'
    );

    await supertest(app).delete('/virtual-gyms/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
