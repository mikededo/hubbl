import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TrainerDTO } from '@hubbl/shared/models/dto';

import { OwnerService, TrainerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { trainerUpdate } from '../helpers';
import { trainerRegister } from './helpers';

class ITrainerRegisterController extends BaseController {
  protected service: TrainerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    return trainerRegister({
      service: this.service,
      controller: this,
      fromJson: TrainerDTO.fromJson,
      fromClass: TrainerDTO.fromClass,
      req,
      res
    });
  }
}

const registerInstance = new ITrainerRegisterController();

export const TrainerRegisterController = registerInstance;

class ITrainerUpdateController extends BaseController {
  protected service: TrainerService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
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
      res
    });
  }
}

const updateInstance = new ITrainerUpdateController();

export const TrainerUpdateController = updateInstance;
