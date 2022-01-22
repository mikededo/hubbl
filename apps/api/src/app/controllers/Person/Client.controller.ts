import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { ClientDTO } from '@hubbl/shared/models/dto';

import { ClientService, OwnerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { clientUpdate } from '../helpers';
import { clientLogin, register } from './helpers';

class IClientRegisterController extends BaseController {
  protected service: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: ClientDTO.fromJson,
      fromClass: ClientDTO.fromClass,
      req,
      res,
      alias: 'client'
    });
  }
}

const registerInstance = new IClientRegisterController();

export const ClientRegisterController = registerInstance;

class IClientLoginController extends BaseController {
  protected service: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    return clientLogin({
      service: this.service,
      controller: this,
      fromJson: ClientDTO.fromJson,
      fromClass: ClientDTO.fromClass,
      req,
      res
    });
  }
}

const loginInstance = new IClientLoginController();

export const ClientLoginController = loginInstance;

class IClientUpdateController extends BaseController {
  protected service: ClientService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    return clientUpdate({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      req,
      res
    });
  }
}

const updateInstance = new IClientUpdateController();

export const ClientUpdateController = updateInstance;
