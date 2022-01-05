import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { DTOGroups, GymZoneDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import {
  GymZoneService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../services';
import BaseController, { UpdateByOwnerWorkerController } from '../Base';
import { createdByOwnerOrWorker, deletedByOwnerOrWorker } from '../helpers';

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

    const { token } = res.locals;

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
      } catch (_) {
        log.error(
          `Controller[${this.constructor.name}]`,
          '"fetch" handler',
          _.toString()
        );

        return this.fail(
          res,
          'Internal server error. If the problem persists, contact our team.'
        );
      }
    } catch (_) {
      log.error(
        `Controller[${this.constructor.name}]`,
        '"fetch" handler',
        _.toString()
      );

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

    const { token } = res.locals;

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

const updateInstance = new UpdateByOwnerWorkerController(
  GymZoneService,
  GymZoneDTO.fromJson,
  'GymZone',
  'updateGymZones'
);

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

    const { token } = res.locals;

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
