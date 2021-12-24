import { Router } from 'express';

import {
  ClientLoginController,
  ClientRegisterController,
  OwnerLoginController,
  OwnerRegisterController,
  TrainerRegisterController,
  WorkerLoginController,
  WorkerRegisterController
} from '../controllers';

const RegisterRouter: Router = Router();

const LoginRouter: Router = Router();

/* REGISTER */

/**
 * @description Registers an owner to the database
 */
RegisterRouter.post('/owner', (req, res) =>
  OwnerRegisterController.execute(req, res)
);

/**
 * @description Registers a worker to the database
 */
RegisterRouter.post('/worker', (req, res) =>
  WorkerRegisterController.execute(req, res)
);

/**
 * @description Registers a trainer to the database
 */
RegisterRouter.post('/trainer', (req, res) =>
  TrainerRegisterController.execute(req, res)
);

/**
 * @description Registers a client to the database
 */
RegisterRouter.post('/client', (req, res) =>
  ClientRegisterController.execute(req, res)
);

/* LOG IN */

/**
 * @description Logs in an owner to the database
 */
LoginRouter.post('/owner', (req, res) =>
  OwnerLoginController.execute(req, res)
);

/**
 * @description Logs in a worker to the database
 */
LoginRouter.post('/worker', (req, res) =>
  WorkerLoginController.execute(req, res)
);

/**
 * @description Logs in a client to the database
 */
LoginRouter.post('/client', (req, res) =>
  ClientLoginController.execute(req, res)
);

const PersonRouter: Router = Router();

PersonRouter.use('/register', RegisterRouter);
PersonRouter.use('/login', LoginRouter);

export default PersonRouter;
