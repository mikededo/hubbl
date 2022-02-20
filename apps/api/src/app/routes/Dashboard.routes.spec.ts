import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Dashboard';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('Dashboard routes', () => {
  it('should call FetchDashboardController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.FetchDashboardController,
      'execute'
    );

    await supertest(app).get('/dashboards/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
