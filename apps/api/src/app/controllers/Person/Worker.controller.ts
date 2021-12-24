import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { WorkerDTO } from '@gymman/shared/models/dto';

import { WorkerService } from '../../services';
import BaseController from '../Base';
import { register, workerLogin } from '../helpers';

export class IWorkerRegisterController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return register(
      this.service,
      this,
      WorkerDTO.fromJson,
      WorkerDTO.fromClass,
      req,
      res,
      'worker'
    );
  }
}

const registerInstance = new IWorkerRegisterController();

export const WorkerRegisterController = registerInstance;

export class IWorkerLoginController extends BaseController {
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
