import { Router } from 'express';
import { EventTypeCreateController } from '../controllers';
import middlewares from '../middlewares';

const EventTypeRouter: Router = Router();

EventTypeRouter.post('', middlewares.auth, (req, res) => {
  EventTypeCreateController.execute(req, res);
});

export default EventTypeRouter;
