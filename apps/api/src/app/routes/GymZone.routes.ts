import { Router } from 'express';

import {
  GymZoneCreateController,
  GymZoneDeleteController,
  GymZoneFetchController,
  GymZoneFetchSingleController,
  GymZoneUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const GymZoneRouter: Router = Router();

/**
 * @description Fetches the list of gym zones from the virtual
 * gym
 */
GymZoneRouter.get('', middlewares.auth, (req, res) => {
  GymZoneFetchController.execute(req, res);
});

/**
 * @description Fetches a single gym zone
 */
GymZoneRouter.get('/:id', middlewares.auth, (req, res) => {
  GymZoneFetchSingleController.execute(req, res);
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
