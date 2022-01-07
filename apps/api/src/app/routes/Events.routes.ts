import { Router } from 'express';

import { EventCreateController, EventUpdateController } from '../controllers';
import middlewares from '../middlewares';

const EventRouter: Router = Router();

/**
 * @description Creates an event in the database
 */
EventRouter.post('', middlewares.auth, (req, res) => {
  EventCreateController.execute(req, res);
});

/**
 * @description Creates an event in the database
 */
EventRouter.put('', middlewares.auth, (req, res) => {
  EventUpdateController.execute(req, res);
});

export default EventRouter;
