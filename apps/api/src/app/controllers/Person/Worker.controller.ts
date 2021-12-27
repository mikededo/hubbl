import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { WorkerDTO } from '@gymman/shared/models/dto';

import { OwnerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { register, workerLogin, workerUpdate } from '../helpers';

class IWorkerRegisterController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: WorkerDTO.fromJson,
      fromClass: WorkerDTO.fromClass,
      req,
      res,
      returnName: 'worker'
    });
  }
}

const registerInstance = new IWorkerRegisterController();

export const WorkerRegisterController = registerInstance;

class IWorkerLoginController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return workerLogin(
      this.service,
      this,
      WorkerDTO.fromJson,
      WorkerDTO.fromClass,
      req,
      res
    );
  }
}

const loginInstance = new IWorkerLoginController();

export const WorkerLoginController = loginInstance;

class IWorkerUpdateController extends BaseController {
  protected service: WorkerService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    return workerUpdate({
      service: this.service,
      ownerService: this.ownerService,
      controller: this,
      req,
      res,
      by: req.query.by as any
    });
  }
}

const updateInstance = new IWorkerUpdateController();

export const WorkerUpdateController = updateInstance;
