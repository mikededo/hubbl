import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as log from 'npmlog';

import { WorkerDTO } from '@hubbl/shared/models/dto';

import { OwnerService, PersonService, WorkerService } from '../../services';
import BaseController from '../Base';
import { workerUpdate } from '../helpers';
import { register, workerLogin } from './helpers';
import { fetch } from './helpers';
import { Gym } from '@hubbl/shared/models/entities';

class IWorkerFetchController extends BaseController {
  protected service: WorkerService = undefined;
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
      this.service = new WorkerService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;
    const { skip } = req.query;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User can not fetch the workers.');
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
        fromClass: WorkerDTO.fromClass,
        gymId: (person.gym as Gym).id,
        alias: 'w',
        skip: +(skip ?? 0)
      });
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchInstance = new IWorkerFetchController();

export const WorkerFetchController = fetchInstance;

class IWorkerCreateController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: WorkerDTO.fromJson,
      fromClass: WorkerDTO.fromClass,
      req,
      res,
      alias: 'worker'
    });
  }
}

const registerInstance = new IWorkerCreateController();

export const WorkerCreateController = registerInstance;

class IWorkerLoginController extends BaseController {
  protected service: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    return workerLogin({
      service: this.service,
      controller: this,
      fromJson: WorkerDTO.fromJson,
      fromClass: WorkerDTO.fromClass,
      req,
      res
    });
  }
}

const loginInstance = new IWorkerLoginController();

export const WorkerLoginController = loginInstance;

class IWorkerUpdateController extends BaseController {
  protected service: WorkerService = undefined;
  protected ownerService: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new WorkerService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    return workerUpdate({
      service: this.service,
      ownerService: this.ownerService,
      controller: this,
      req,
      res
    });
  }
}

const updateInstance = new IWorkerUpdateController();

export const WorkerUpdateController = updateInstance;
