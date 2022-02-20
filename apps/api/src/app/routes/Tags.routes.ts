import { Router } from 'express';

import {
  TrainerTagCreateController,
  TrainerTagDeleteController,
  TrainerTagFetchController,
  TrainerTagUpdateController
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

TrainerTagRouter.put('/:id', middlewares.auth, (req, res) => {
  TrainerTagUpdateController.execute(req, res);
});

TrainerTagRouter.delete('/:id', middlewares.auth, (req, res) => {
  TrainerTagDeleteController.execute(req, res);
});

TagRouter.use('/trainer', TrainerTagRouter);

export default TagRouter;
