import { Router } from 'express';

import {
  CalendarFetchEventsController,
  CalendarFetchEventAppointmentsController
} from '../controllers';
import middlewares from '../middlewares';

const CalendarRouter: Router = Router();

/**
 * @descirption Returns the list of events that exist within a
 * week for the selected calendar
 */
CalendarRouter.get('/:id', middlewares.auth, (req, res) => {
  CalendarFetchEventsController.execute(req, res);
});

/**
 * @descirption Returns the list of appointments with the client
 * informations for a selected event
 */
CalendarRouter.get('/:id/events/:eId', middlewares.auth, (req, res) => {
  CalendarFetchEventAppointmentsController.execute(req, res);
});

export default CalendarRouter;
