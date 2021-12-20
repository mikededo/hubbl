import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { OwnerDTO } from '@gymman/shared/models/dto';

import { OwnerService } from '../../services';
import BaseController from '../Base';
import { register } from '../helpers';

export class OwnerRegisterController extends BaseController {
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
      res
    );
  }
}
