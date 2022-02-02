import { Router } from 'express';

import {
  VirtualGymCreateController,
  VirtualGymDeleteController,
  VirtualGymFetchController,
  VirtualGymUpdateController
} from '../controllers';
import GymZoneRouter from './GymZone.routes';
import middlewares from '../middlewares';

const VirtualGymRouter: Router = Router();

/**
 * @description Fetches the list of virtual gyms for the current
 * user.
 */
VirtualGymRouter.get('', middlewares.auth, (req, res) => {
  VirtualGymFetchController.execute(req, res);
});

/**
 * @description Creates a new virtual gym iff the user making
 * the request is a gym owner.
 */
VirtualGymRouter.post('', middlewares.auth, (req, res) => {
  VirtualGymCreateController.execute(req, res);
});

/**
 * @description Updates a virtual gym iff the user making the
 * request is either an owner or a worker (with permissions).
 */
VirtualGymRouter.put('', middlewares.auth, (req, res) => {
  VirtualGymUpdateController.execute(req, res);
});

/**
 * @description Deletes a virtual gym iff the user making the
 * request is a the owner of the gym to which the gym zone
 * belongs.
 */
VirtualGymRouter.delete('/:id', middlewares.auth, (req, res) => {
  VirtualGymDeleteController.execute(req, res);
});

// Attach gym zones routes
VirtualGymRouter.use('/:vgId/gym-zones', GymZoneRouter);

export default VirtualGymRouter;
