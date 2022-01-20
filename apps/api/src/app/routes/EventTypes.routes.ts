import { Router } from 'express';

import {
  EventTypeCreateController,
  EventTypeDeleteController,
  EventTypeFetchController,
  EventTypeUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const EventTypeRouter: Router = Router();

/**
 * @description Fetches the event types of a gym
 */
EventTypeRouter.get('', middlewares.auth, (req, res) => {
  EventTypeFetchController.execute(req, res);
});

/**
 * @description Creates an event type in the databse
 */
EventTypeRouter.post('', middlewares.auth, (req, res) => {
  EventTypeCreateController.execute(req, res);
});

/**
 * @description Updates an event type in the databse
 */
EventTypeRouter.put('', middlewares.auth, (req, res) => {
  EventTypeUpdateController.execute(req, res);
});

/**
 * @description Deletes an event type in the databse
 */
EventTypeRouter.delete('/:id', middlewares.auth, (req, res) => {
  EventTypeDeleteController.execute(req, res);
});

export default EventTypeRouter;
