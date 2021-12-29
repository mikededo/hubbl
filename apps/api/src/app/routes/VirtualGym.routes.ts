import { Router } from 'express';

import {
  VirtualGymCreateController,
  VirtualGymDeleteController,
  VirtualGymFetchController,
  VirtualGymUpdateController
} from '../controllers';
import middlewares from '../middlewares';

const VirtualGymRouter: Router = Router();

VirtualGymRouter.get('', middlewares.auth, (req, res) => {
  VirtualGymFetchController.execute(req, res);
});

VirtualGymRouter.post('', middlewares.auth, (req, res) => {
  VirtualGymCreateController.execute(req, res);
});

VirtualGymRouter.put('', middlewares.auth, (req, res) => {
  VirtualGymUpdateController.execute(req, res);
});

VirtualGymRouter.delete('/:id', middlewares.auth, (req, res) => {
  VirtualGymDeleteController.execute(req, res);
});

export default VirtualGymRouter;
