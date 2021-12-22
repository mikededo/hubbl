import { ClientDTO } from '@gymman/shared/models/dto';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ClientService } from '../../services';
import BaseController from '../Base';
import { register } from '../helpers';

export class ClientRegisterController extends BaseController {
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
      res
    );
  }
}
