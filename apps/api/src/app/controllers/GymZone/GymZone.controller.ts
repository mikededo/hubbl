import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, GymZoneDTO } from '@gymman/shared/models/dto';
import { Gym } from '@gymman/shared/models/entities';

import {
  GymZoneService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../services';
import BaseController from '../Base';
import {
  createdByOwnerOrWorker,
  deletedByOwnerOrWorker,
  ParsedToken,
  updatedByOwnerOrWorker
} from '../helpers';

class IGymZoneFetchController extends BaseController {
  protected service: GymZoneService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new GymZoneService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    try {
      const person = await this.personService.findOne(token.id);

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      try {
        const result = await this.service
          .createQueryBuilder({ alias: 'gymZone' })
          .leftJoinAndSelect('gymZone.calendar', 'calendar')
          .leftJoinAndSelect(
            'gymZone.virtualGym',
            'virtualGym',
            'virtualGym.id = :id',
            { id: req.params.vgId }
          )
          .leftJoin('virtualGym.gym', 'gym', 'gym.id = :id', {
            id: (person.gym as Gym).id
          })
          .where('gymZone.id = :gymZoneId', { gymZoneId: req.params.id })
          .getOne();
          
        return this.ok(res, await GymZoneDTO.fromClass(result));
      } catch (e) {
        return this.fail(
          res,
          'Internal server error. If the problem persists, contact our team.'
        );
      }
    } catch (_) {
      return this.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }
  }
}

const fetchInstance = new IGymZoneFetchController();

export const GymZoneFetchController = fetchInstance;

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

    if (!this.workerService) {
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

class IGymZoneUpdateController extends BaseController {
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

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    try {
      const dto = await GymZoneDTO.fromJson(req.body, DTOGroups.UPDATE);

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        token,
        by: req.query.by as any,
        dto,
        entityName: 'GymZone',
        updatableBy: '["owner", "worker"]',
        countArgs: { id: dto.id },
        workerUpdatePermission: 'updateGymZones'
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}

const updateInstance = new IGymZoneUpdateController();

export const GymZoneUpdateController = updateInstance;

class IGymZoneDeleteController extends BaseController {
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

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    return deletedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token,
      by: req.query.by as any,
      entityId: req.params.id,
      entityName: 'GymZone',
      countArgs: { id: req.params.id },
      workerDeletePermission: 'deleteGymZones'
    });
  }
}

const deleteInstance = new IGymZoneDeleteController();

export const GymZoneDeleteController = deleteInstance;
