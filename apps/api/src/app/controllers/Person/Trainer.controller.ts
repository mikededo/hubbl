import { TrainerDTO } from '@gymman/shared/models/dto';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TrainerService } from '../../services';
import BaseController from '../Base';
import { register } from '../helpers';

export class TrainerRegisterController extends BaseController {
  protected service: TrainerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    return register(
      this.service,
      this,
      TrainerDTO.fromJson,
      TrainerDTO.fromClass,
      req,
      res,
      'trainer'
    );
  }
}
