import { Router } from 'express';

import {
  EventTypeCreateController,
  EventTypeDeleteController,
  EventTypeFetchController,
  EventTypeUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const EventTypeRouter: Router = Router();

EventTypeRouter.get('', middlewares.auth, (req, res) => {
  EventTypeFetchController.execute(req, res);
});

EventTypeRouter.post('', middlewares.auth, (req, res) => {
  EventTypeCreateController.execute(req, res);
});

EventTypeRouter.put('', middlewares.auth, (req, res) => {
  EventTypeUpdateController.execute(req, res);
});

EventTypeRouter.delete('/:id', middlewares.auth, (req, res) => {
  EventTypeDeleteController.execute(req, res);
});

export default EventTypeRouter;
