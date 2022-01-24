import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Event';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('Event routes', () => {
  it('should call EventCreateController.execute', async () => {
    const executeSpy = jest.spyOn(controllers.EventCreateController, 'execute');

    await supertest(app).post('/events');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(controllers.EventUpdateController, 'execute');

    await supertest(app).put('/events');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventDeleteController.execute', async () => {
    const executeSpy = jest.spyOn(controllers.EventDeleteController, 'execute');

    await supertest(app).delete('/events/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
