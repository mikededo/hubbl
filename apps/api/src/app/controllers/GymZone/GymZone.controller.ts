import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, GymZoneDTO } from '@gymman/shared/models/dto';

import { GymZoneService, OwnerService, WorkerService } from '../../services';
import BaseController from '../Base';
import { createdByOwnerOrWorker, ParsedToken } from '../helpers';

class IGymZoneCreateController extends BaseController {
  protected service: GymZoneService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new GymZoneService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if(!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    try {
      return createdByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        fromClass: GymZoneDTO.fromClass,
        token,
        by: req.query.by as any,
        dto: await GymZoneDTO.fromJson(req.body, DTOGroups.CREATE),
        entityName: 'GymZone',
        workerCreatePermission: 'createGymZones'
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}

const createInstance = new IGymZoneCreateController();

export const GymZoneCreateController = createInstance;