import { Router } from 'express';

import { Appointments } from '../controllers';
import middlewares from '../middlewares';

const AppointmentsRouter: Router = Router();
const EventAppointmentRouter: Router = Router();
const CalendarAppointmentRouter: Router = Router();

/* EVENTS */
  EventAppointmentRouter.post('', middlewares.auth, (req, res) => {
    Appointments.EventCreateController.execute(req, res);
  });

EventAppointmentRouter.put('/:eId/cancel/:id', middlewares.auth, (req, res) => {
  Appointments.EventCancelController.execute(req, res);
});

EventAppointmentRouter.delete('/:eId/:id', middlewares.auth, (req, res) => {
  Appointments.EventDeleteController.execute(req, res);
});

/* CALENDARS */
CalendarAppointmentRouter.get('/:id', middlewares.auth, (req, res) => {
  Appointments.CalendarFetchController.execute(req, res);
});

CalendarAppointmentRouter.post('', middlewares.auth, (req, res) => {
  Appointments.CalendarCreateController.execute(req, res);
});

CalendarAppointmentRouter.put('/cancel/:id', middlewares.auth, (req, res) => {
  Appointments.CalendarCancelController.execute(req, res);
});

CalendarAppointmentRouter.delete('/:id', middlewares.auth, (req, res) => {
  Appointments.CalendarDeleteController.execute(req, res);
});

AppointmentsRouter.use('/events', EventAppointmentRouter);
AppointmentsRouter.use('/calendars', CalendarAppointmentRouter);

export default AppointmentsRouter;
