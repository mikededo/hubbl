import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TrainerDTO } from '@gymman/shared/models/dto';

import { OwnerService, TrainerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { register, trainerUpdate } from '../helpers';

class ITrainerRegisterController extends BaseController {
  protected service: TrainerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: TrainerDTO.fromJson,
      fromClass: TrainerDTO.fromClass,
      req,
      res,
      returnName: 'trainer'
    });
  }
}

const registerInstance = new ITrainerRegisterController();

export const TrainerRegisterController = registerInstance;

class ITrainerUpdateController extends BaseController {
  protected service: TrainerService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    return trainerUpdate({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      req,
      res,
      by: req.query.by as any
    });
  }
}

const updateInstance = new ITrainerUpdateController();

export const TrainerUpdateController = updateInstance;
