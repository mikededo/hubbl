import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { ClientDTO } from '@gymman/shared/models/dto';

import { ClientService } from '../../services';
import BaseController from '../Base';
import { clientLogin, register } from '../helpers';

class IClientRegisterController extends BaseController {
  protected service: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    return register(
      this.service,
      this,
      ClientDTO.fromJson,
      ClientDTO.fromClass,
      req,
      res,
      'client'
    );
  }
}

const registerInstance = new IClientRegisterController();

export const ClientRegisterController = registerInstance;

class IClientLoginController extends BaseController {
  protected service: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    return clientLogin(
      this.service,
      this,
      ClientDTO.fromJson,
      ClientDTO.fromClass,
      req,
      res
    );
  }
}

const loginInstance = new IClientLoginController();

export const ClientLoginController = loginInstance;
