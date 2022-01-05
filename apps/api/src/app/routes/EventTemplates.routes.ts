import { Router } from 'express';

import {
  EventTemplateCreateController,
  EventTemplateDeleteController,
  EventTemplateUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const EventTemplateRouter: Router = Router();

/**
 * @description Creates an event template in the database
 */
EventTemplateRouter.post('', middlewares.auth, (req, res) => {
  EventTemplateCreateController.execute(req, res);
});

/**
 * @description Updates an event template in the database
 */
EventTemplateRouter.put('', middlewares.auth, (req, res) => {
  EventTemplateUpdateController.execute(req, res);
});

/**
 * @description Deletes an event template in the database
 */
EventTemplateRouter.delete('/:id', middlewares.auth, (req, res) => {
  EventTemplateDeleteController.execute(req, res);
});

export default EventTemplateRouter;
