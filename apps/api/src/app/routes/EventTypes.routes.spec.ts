import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/EventType';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('EventType routes', () => {
  it('should call EventTypeFetchController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTypeFetchController,
      'execute'
    );

    await supertest(app).get('/event-types');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTypeCreateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTypeCreateController,
      'execute'
    );

    await supertest(app).post('/event-types');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTypeUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTypeUpdateController,
      'execute'
    );

    await supertest(app).put('/event-types');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTypeDeleteController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTypeDeleteController,
      'execute'
    );

    await supertest(app).delete('/event-types/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
