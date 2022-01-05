import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { DTOGroups } from '@hubbl/shared/types';

import { OwnerService, PersonService, VirtualGymService } from '../../services';
import BaseController, { UpdateByOwnerWorkerController } from '../Base';
import { createdByOwner, deletedByOwner } from '../helpers';

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

    const { token } = res.locals;

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
          await Promise.all(result.map((vg) => VirtualGymDTO.fromClass(vg)))
        );
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

    const { token } = res.locals;

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

const updateInstance = new UpdateByOwnerWorkerController(
  VirtualGymService,
  VirtualGymDTO.fromJson,
  'VirtualGym',
  'updateVirtualGyms'
);

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

    const { token } = res.locals;

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
