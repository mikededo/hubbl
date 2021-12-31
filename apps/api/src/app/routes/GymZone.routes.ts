import { Router } from 'express';
import { GymZoneCreateController } from '../controllers';
import middlewares from '../middlewares';

const GymZoneRouter: Router = Router();

/**
 * @description Creates a gym zone in the database
 */
GymZoneRouter.post('', middlewares.auth, (req, res) => {
  GymZoneCreateController.execute(req, res);
});

export default GymZoneRouter;
