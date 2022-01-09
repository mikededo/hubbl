import { Router } from 'express';

import { Appointments } from '../controllers';
import middlewares from '../middlewares';

const AppointmentsRouter: Router = Router();
const EventAppointmentRouter: Router = Router();

/* EVENTS */
EventAppointmentRouter.post('', middlewares.auth, (req, res) => {
  Appointments.EventCreateController.execute(req, res);
});

AppointmentsRouter.use('/events', EventAppointmentRouter);

export default AppointmentsRouter;
