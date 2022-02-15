import { Router } from 'express';

import { Appointments } from '../controllers';
import middlewares from '../middlewares';

const AppointmentsRouter: Router = Router();
const EventAppointmentRouter: Router = Router();
const CalendarAppointmentRouter: Router = Router();

/* EVENTS */
/**
 * @description Creates an appointment to an event
 */
EventAppointmentRouter.post('', middlewares.auth, (req, res) => {
  Appointments.EventCreateController.execute(req, res);
});

/**
 * @description Cancels an appointment made for an event
 */
EventAppointmentRouter.put('/:eId/cancel/:id', middlewares.auth, (req, res) => {
  Appointments.EventCancelController.execute(req, res);
});

/**
 * @description Deletes an appointment made for an event
 */
EventAppointmentRouter.delete('/:eId/:id', middlewares.auth, (req, res) => {
  Appointments.EventDeleteController.execute(req, res);
});

/* CALENDARS */
/**
 * @description Fetches the list of available intervals for the given
 * date and interval
 */
CalendarAppointmentRouter.get('/:id', middlewares.auth, (req, res) => {
  Appointments.CalendarFetchController.execute(req, res);
});

/**
 * @description Creates an appointment to a calendar
 */
CalendarAppointmentRouter.post('', middlewares.auth, (req, res) => {
  Appointments.CalendarCreateController.execute(req, res);
});

/**
 * @description Cancels an appointment made for a calendar
 */
CalendarAppointmentRouter.put(
  '/:cId/cancel/:id',
  middlewares.auth,
  (req, res) => {
    Appointments.CalendarCancelController.execute(req, res);
  }
);

/**
 * @description Deletes an appointment made for a calendar
 */
CalendarAppointmentRouter.delete('/:cId/:id', middlewares.auth, (req, res) => {
  Appointments.CalendarDeleteController.execute(req, res);
});

AppointmentsRouter.use('/events', EventAppointmentRouter);
AppointmentsRouter.use('/calendars', CalendarAppointmentRouter);

export default AppointmentsRouter;
