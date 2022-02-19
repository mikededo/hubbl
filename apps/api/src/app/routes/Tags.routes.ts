import { Router } from 'express';

import {
  TrainerTagCreateController,
  TrainerTagFetchController
} from '../controllers';
import middlewares from '../middlewares';

const TagRouter = Router();

const TrainerTagRouter = Router();

TrainerTagRouter.get('', middlewares.auth, (req, res) => {
  TrainerTagFetchController.execute(req, res);
});

TrainerTagRouter.post('', middlewares.auth, (req, res) => {
  TrainerTagCreateController.execute(req, res);
});

TagRouter.use('/trainer', TrainerTagRouter);

export default TagRouter;
