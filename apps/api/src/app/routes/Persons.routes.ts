import { Router } from 'express';
import { OwnerRegisterController } from '../controllers';

const PersonRouter: Router = Router();

const ownerController = new OwnerRegisterController();

/**
 * @description Registers an owner to the database
 */
PersonRouter.post('/register/owner', (req, res) =>
  ownerController.execute(req, res)
);

export default PersonRouter;
