import { Router } from 'express';

import { TrainerTagFetchController } from '../controllers';
import middlewares from '../middlewares';

const TagRouter = Router();

const TrainerTagRouter = Router();

TrainerTagRouter.get('', middlewares.auth, (req, res) => {
  TrainerTagFetchController.execute(req, res);
});

TagRouter.use('/trainer', TrainerTagRouter);

export default TagRouter;
