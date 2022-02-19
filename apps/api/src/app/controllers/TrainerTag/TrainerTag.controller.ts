import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DTOGroups, TrainerTagDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import {
  OwnerService,
  PersonService,
  TrainerTagService,
  WorkerService
} from '../../services';
import BaseController from '../Base';
import { createdByOwnerOrWorker, updatedByOwnerOrWorker } from '../helpers';

class ITrainerTagFetchController extends BaseController {
  private service: TrainerTagService = undefined;
  private personService: PersonService = undefined;

  protected async run(_: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerTagService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User does not have permissions.');
    }

    // Get the gym of the person
    try {
      // Check if the person exists
      // Get the person, if any
      const person = await this.personService.findOne({
        id: token.id,
        options: { select: ['id', 'gym'] }
      });

      if (!person) {
        return this.unauthorized(res, 'Person does not exist.');
      }

      // Fetch the tags
      const tags = await this.service.find({
        where: { gym: (person.gym as Gym).id }
      });

      return this.ok(
        res,
        tags.map((tag) => TrainerTagDTO.fromClass(tag))
      );
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchnstance = new ITrainerTagFetchController();

export const TrainerTagFetchController = fetchnstance;

class ITrainerTagCreateController extends BaseController {
  protected service: TrainerTagService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerTagService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    const { token } = res.locals;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User does not have permissions.');
    }

    return createdByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: TrainerTagDTO.fromClass,
      token,
      dto: await TrainerTagDTO.fromJson(req.body, DTOGroups.CREATE),
      entityName: 'TrainerTag',
      workerCreatePermission: 'createTags'
    });
  }
}

const createInstance = new ITrainerTagCreateController();

export const TrainerTagCreateController = createInstance;

class ITrainerTagUpdateController extends BaseController {
  protected service: TrainerTagService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerTagService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    const { token } = res.locals;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User does not have permissions.');
    }

    if (!req.params.id) {
      return this.clientError(res, 'No TrainerTag id given.');
    }

    return updatedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      token,
      res,
      dto: await TrainerTagDTO.fromJson(req.body, DTOGroups.UPDATE),
      entityName: 'TrainerTag',
      countArgs: { id: req.params.id },
      workerUpdatePermission: 'updateTags'
    });
  }
}

const UpdateInstance = new ITrainerTagUpdateController();

export const TrainerTagUpdateController = UpdateInstance;
