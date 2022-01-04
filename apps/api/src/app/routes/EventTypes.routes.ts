import { Router } from 'express';

import {
  EventTypeCreateController,
  EventTypeUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const EventTypeRouter: Router = Router();

EventTypeRouter.post('', middlewares.auth, (req, res) => {
  EventTypeCreateController.execute(req, res);
});

EventTypeRouter.put('', middlewares.auth, (req, res) => {
  EventTypeUpdateController.execute(req, res);
});

export default EventTypeRouter;
