import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Calendar';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('Calendar routes', () => {
  it('should call CalendarFetchEventsController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.CalendarFetchEventsController,
      'execute'
    );

    await supertest(app).get('/calendars/1/events');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call CalendarFetchEventAppointmentsController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.CalendarFetchEventAppointmentsController,
      'execute'
    );

    await supertest(app).get('/calendars/1/events/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call CalendarFetchCalenAppointmentsController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.CalendarFetchCalenAppointmentsController,
      'execute'
    );

    await supertest(app).get('/calendars/1/calendars');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
