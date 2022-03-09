import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DTOGroups, GymDTO } from '@hubbl/shared/models/dto';

import { GymService, OwnerService } from '../../services';
import BaseController from '../Base';
import { updatedByOwnerOrWorker } from '../helpers';

class IGymUpdateController extends BaseController {
  protected service: GymService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new GymService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    const { token } = res.locals;

    try {
      const dto = await GymDTO.fromJson(req.body, DTOGroups.UPDATE);

      // Check if owner owns the gym
      const count = await this.ownerService.count({
        where: { id: token.id as number, gym: dto.id }
      });
      if (!count) {
        return this.forbidden(res, 'User does not own the gym.');
      }

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: undefined,
        controller: this,
        res,
        token,
        dto,
        entityName: 'Gym',
        countArgs: { id: dto.id },
        workerUpdatePermission: undefined
      });
    } catch (e) {
      return this.onFail(res, e, 'update');
    }
  }
}

const updateInstance = new IGymUpdateController();

export const GymUpdateController = updateInstance;
