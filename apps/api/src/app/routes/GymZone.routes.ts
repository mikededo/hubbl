import { Router } from 'express';

import {
  GymZoneCreateController,
  GymZoneDeleteController,
  GymZoneFetchController,
  GymZoneUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const GymZoneRouter: Router = Router();

/**
 * @description Creates a gym zone in the database
 */
GymZoneRouter.get('/:id', middlewares.auth, (req, res) => {
  GymZoneFetchController.execute(req, res);
});

/**
 * @description Creates a gym zone in the database
 */
GymZoneRouter.post('', middlewares.auth, (req, res) => {
  GymZoneCreateController.execute(req, res);
});

/**
 * @description Updates a gym zone in the database
 */
GymZoneRouter.put('', middlewares.auth, (req, res) => {
  GymZoneUpdateController.execute(req, res);
});

/**
 * @description Deletes a gym zone in the database
 */
GymZoneRouter.delete('/:id', middlewares.auth, (req, res) => {
  GymZoneDeleteController.execute(req, res);
});

export default GymZoneRouter;
