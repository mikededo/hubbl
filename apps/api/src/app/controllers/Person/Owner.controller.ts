import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OwnerDTO } from '@gymman/shared/models/dto';

import { OwnerService } from '../../services';
import BaseController from '../Base';
import { ownerLogin, register } from '../helpers';

class IOwnerRegisterController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    return register(
      this.service,
      this,
      OwnerDTO.fromJson,
      OwnerDTO.fromClass,
      req,
      res,
      'owner'
    );
  }
}

const registerInstance = new IOwnerRegisterController();

export const OwnerRegisterController = registerInstance;

class IOwnerLoginController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    return ownerLogin(
      this.service,
      this,
      OwnerDTO.fromJson,
      OwnerDTO.fromClass,
      req,
      res
    );
  }
}

const loginInstance = new IOwnerLoginController();

export const OwnerLoginController = loginInstance;
