import { WorkerDTO } from '@gymman/shared/models/dto';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { WorkerService } from '../../services';
import BaseController from '../Base';
import { register } from '../helpers';

export class WorkerRegisterController extends BaseController {
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
      res
    );
  }
}
