import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TrainerDTO } from '@gymman/shared/models/dto';

import { TrainerService } from '../../services';
import BaseController from '../Base';
import { register } from '../helpers';

class ITrainerRegisterController extends BaseController {
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

const registerInstance = new ITrainerRegisterController();

export const TrainerRegisterController = registerInstance;
