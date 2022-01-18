import { Router } from 'express';

import { CalendarFetchEventsController } from '../controllers';
import middlewares from '../middlewares';

const CalendarRouter: Router = Router();

/**
 * @descirption Returns the list of events that exist within a
 * week for the selected calendar
 */
CalendarRouter.get('/:id', middlewares.auth, (req, res) => {
  CalendarFetchEventsController.execute(req, res);
});

export default CalendarRouter;
