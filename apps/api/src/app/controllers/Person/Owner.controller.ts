import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OwnerDTO } from '@hubbl/shared/models/dto';

import { OwnerService } from '../../services';
import BaseController from '../Base';
import { ownerUpdate } from '../helpers';
import { ownerLogin, register } from './helpers';

class IOwnerRegisterController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: OwnerDTO.fromJson,
      fromClass: OwnerDTO.fromClass,
      req,
      res,
      alias: 'owner'
    });
  }
}

const registerInstance = new IOwnerRegisterController();

export const OwnerRegisterController = registerInstance;

class IOwnerLoginController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    return ownerLogin({
      service: this.service,
      controller: this,
      fromJson: OwnerDTO.fromJson,
      fromClass: OwnerDTO.fromClass,
      req,
      res
    });
  }
}

const loginInstance = new IOwnerLoginController();

export const OwnerLoginController = loginInstance;

class IOwnerUpdateController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    return ownerUpdate({
      service: this.service,
      controller: this,
      req,
      res
    });
  }
}

const updateInstance = new IOwnerUpdateController();

export const OwnerUpdateController = updateInstance;
