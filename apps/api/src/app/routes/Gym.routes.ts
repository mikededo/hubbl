import { Router } from 'express';
import { GymUpdateController } from '../controllers';
import middlewares from '../middlewares';

const GymRouter: Router = Router();

/**
 * @description Updates a gym by an owner
 */
GymRouter.put('', middlewares.auth, (req, res) => {
  GymUpdateController.execute(req, res);
});

export default GymRouter;
