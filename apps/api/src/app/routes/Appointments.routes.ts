import { Router } from 'express';

import { Appointments } from '../controllers';
import middlewares from '../middlewares';

const AppointmentsRouter: Router = Router();
const EventAppointmentRouter: Router = Router();

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

AppointmentsRouter.use('/events', EventAppointmentRouter);

export default AppointmentsRouter;
