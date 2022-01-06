import { Router } from 'express';
import { EventCreateController } from '../controllers';
import middlewares from '../middlewares';

const EventRouter: Router = Router();

/**
 * @description Creates an event in the database
 */
EventRouter.post('', middlewares.auth, (req, res) => {
  EventCreateController.execute(req, res);
});

export default EventRouter;
