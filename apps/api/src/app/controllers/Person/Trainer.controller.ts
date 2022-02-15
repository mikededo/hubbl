import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { TrainerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import {
  OwnerService,
  PersonService,
  TrainerService,
  WorkerService
} from '../../services';
import BaseController from '../Base';
import { trainerUpdate } from '../helpers';
import { fetch, trainerRegister } from './helpers';

class ITrainerFetchController extends BaseController {
  protected service: TrainerService = undefined;
  protected personService: PersonService = undefined;

  private onFail(res: Response, error: any): Response {
    log.error(
      `Controller [${this.constructor.name}]`,
      '"fetch" handler',
      error.toString()
    );

    return this.fail(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;
    const { skip } = req.query;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User can not fetch the trainers.');
    }

    try {
      // Check if the person exists
      // Get the person, if any
      const person = await this.personService.findOne({ id: token.id });

      if (!person) {
        return this.unauthorized(res, 'Person does not exist');
      }

      return fetch({
        service: this.service,
        controller: this,
        res,
        fromClass: TrainerDTO.fromClass,
        gymId: (person.gym as Gym).id,
        alias: 't',
        personFk: 'trainer_person_fk',
        skip: +(skip ?? 0)
      });
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchInstance = new ITrainerFetchController();

export const TrainerFetchController = fetchInstance;

class ITrainerCreateController extends BaseController {
  protected service: TrainerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    return trainerRegister({
      service: this.service,
      controller: this,
      fromJson: TrainerDTO.fromJson,
      fromClass: TrainerDTO.fromClass,
      req,
      res
    });
  }
}

const registerInstance = new ITrainerCreateController();

export const TrainerCreateController = registerInstance;

class ITrainerUpdateController extends BaseController {
  protected service: TrainerService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    return trainerUpdate({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      req,
      res
    });
  }
}

const updateInstance = new ITrainerUpdateController();

export const TrainerUpdateController = updateInstance;
