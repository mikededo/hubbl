import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/Appointments';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

// TODO: Fixme #time 2h
describe('Appointment routes', () => {
  describe('Event appoinments', () => {
    it('should call EventCreateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.EventCreateController,
        'execute'
      );

      await supertest(app).post('/appointments/events');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call EventCancelController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.EventCancelController,
        'execute'
      );

      await supertest(app).put('/appointments/events/1/cancel/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call EventDeleteController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.EventDeleteController,
        'execute'
      );

      await supertest(app).delete('/appointments/events/1/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Calendar appoinments', () => {
    it('should call CalendarFetchController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.CalendarFetchController,
        'execute'
      );

      await supertest(app).get('/appointments/calendars/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call CalendarCreateController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.CalendarCreateController,
        'execute'
      );

      await supertest(app).post('/appointments/calendars');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call CalendarCancelController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.CalendarCancelController,
        'execute'
      );

      await supertest(app).put('/appointments/calendars/cancel/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call CalendarDeleteController.execute', async () => {
      const executeSpy = jest.spyOn(
        controllers.Appointments.CalendarDeleteController,
        'execute'
      );

      await supertest(app).delete('/appointments/calendars/1');

      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
