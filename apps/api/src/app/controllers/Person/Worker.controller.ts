import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { WorkerDTO } from '@hubbl/shared/models/dto';

import { OwnerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { workerUpdate } from '../helpers';
import { register, workerLogin } from './helpers';

class IWorkerRegisterController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
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
      alias: 'worker'
    });
  }
}

const registerInstance = new IWorkerRegisterController();

export const WorkerRegisterController = registerInstance;

class IWorkerLoginController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return workerLogin({
      service: this.service,
      controller: this,
      fromJson: WorkerDTO.fromJson,
      fromClass: WorkerDTO.fromClass,
      req,
      res
    });
  }
}

const loginInstance = new IWorkerLoginController();

export const WorkerLoginController = loginInstance;

class IWorkerUpdateController extends BaseController {
  protected service: WorkerService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
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
      res
    });
  }
}

const updateInstance = new IWorkerUpdateController();

export const WorkerUpdateController = updateInstance;
