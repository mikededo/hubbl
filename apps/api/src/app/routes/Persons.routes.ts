import { Router } from 'express';

import {
  ClientRegisterController,
  OwnerRegisterController,
  TrainerRegisterController,
  WorkerRegisterController
} from '../controllers';

const PersonRouter: Router = Router();

const ownerController = new OwnerRegisterController();
const trainerController = new TrainerRegisterController();
const workerController = new WorkerRegisterController();
const clientController = new ClientRegisterController();

/**
 * @description Registers an owner to the database
 */
PersonRouter.post('/register/owner', (req, res) =>
  ownerController.execute(req, res)
);

/**
 * @description Registers an worker to the database
 */
PersonRouter.post('/register/worker', (req, res) =>
  workerController.execute(req, res)
);

/**
 * @description Registers an trainer to the database
 */
PersonRouter.post('/register/trainer', (req, res) =>
  trainerController.execute(req, res)
);

/**
 * @description Registers an client to the database
 */
PersonRouter.post('/register/client', (req, res) =>
  clientController.execute(req, res)
);

export default PersonRouter;
