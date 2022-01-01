import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, VirtualGymDTO } from '@gymman/shared/models/dto';
import { Gym } from '@gymman/shared/models/entities';

import {
  OwnerService,
  PersonService,
  VirtualGymService,
  WorkerService
} from '../../services';
import BaseController from '../Base';
import {
  createdByOwner,
  deletedByOwner,
  ParsedToken,
  updatedByOwnerOrWorker
} from '../helpers';

class IVirtualGymFetchController extends BaseController {
  protected service: VirtualGymService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new VirtualGymService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    try {
      // Get the person, if any
      const person = await this.personService.findOne(token.id);

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      // Find the virtual gyms of the gym to which the token is validated
      try {
        const result = await this.service
          .createQueryBuilder({ alias: 'virtualGym' })
          .where('virtualGym.gym = :gym', { gym: (person.gym as Gym).id })
          .getMany();

        return this.ok(
          res,
          await Promise.all(
            result.map(async (vg) => await VirtualGymDTO.fromClass(vg))
          )
        );
      } catch (_) {
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

const fetchInstance = new IVirtualGymFetchController();

export const VirtualGymFetchController = fetchInstance;

class IVirtualGymCreateController extends BaseController {
  protected service: VirtualGymService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new VirtualGymService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    try {
      return createdByOwner({
        service: this.service,
        ownerService: this.ownerService,
        controller: this,
        res,
        fromClass: VirtualGymDTO.fromClass,
        token,
        dto: await VirtualGymDTO.fromJson(req.body, DTOGroups.CREATE),
        entityName: 'VirtualGym'
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}

const createInstance = new IVirtualGymCreateController();

export const VirtualGymCreateController = createInstance;

class IVirtualGymUpdateController extends BaseController {
  protected service: VirtualGymService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new VirtualGymService(getRepository);
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
      const dto = await VirtualGymDTO.fromJson(req.body, DTOGroups.UPDATE);

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        token,
        dto,
        by: req.query.by as any,
        entityName: 'VirtualGym',
        updatableBy: '["owner", "worker"]',
        workerUpdatePermission: 'updateVirtualGyms',
        countArgs: { id: dto.id }
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}

const updateInstance = new IVirtualGymUpdateController();

export const VirtualGymUpdateController = updateInstance;

class IVirtualGymDeleteController extends BaseController {
  protected service: VirtualGymService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new VirtualGymService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    // Get the token. Token should be validate a priori, since it is an
    // authorized call
    const tokenValues = req.headers.authorization.split(' ');
    const token = decode(tokenValues[1]) as ParsedToken;

    return deletedByOwner({
      service: this.service,
      ownerService: this.ownerService,
      controller: this,
      res,
      token,
      entityId: req.params.id,
      entityName: 'VirtualGym',
      countArgs: { id: req.params.id }
    });
  }
}

const deleteInstance = new IVirtualGymDeleteController();

export const VirtualGymDeleteController = deleteInstance;