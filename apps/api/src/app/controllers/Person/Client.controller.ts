import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { ClientDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import {
  ClientService,
  GymService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../services';
import BaseController from '../Base';
import { clientUpdate } from '../helpers';
import { clientLogin, fetch, register } from './helpers';

class IClientFetchController extends BaseController {
  protected service: ClientService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;
    const { skip } = req.query;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(res, 'User can not fetch the clients.');
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
        fromClass: ClientDTO.fromClass,
        gymId: (person.gym as Gym).id,
        alias: 'c',
        skip: +(skip ?? 0)
      });
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchInstance = new IClientFetchController();

export const ClientFetchController = fetchInstance;

class IClientRegisterController extends BaseController {
  protected service: ClientService = undefined;
  protected gymService: GymService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    if (!this.gymService) {
      this.gymService = new GymService(getRepository);
    }

    const { code } = req.query;

    if (code) {
      try {
        // Find the gym if the call has the gym code
        const gym = await this.gymService.findOne({
          options: {
            where: { code },
            select: ['id'],
            loadEagerRelations: false
          }
        });

        if (!gym) {
          return this.unauthorized(res, 'Gym code does not belong to any gym.');
        }

        // Set the gym
        req.body.gym = gym.id;
      } catch (e) {
        return this.onFail(res, e, 'register');
      }
    }

    return register({
      service: this.service,
      controller: this,
      fromJson: ClientDTO.fromJson,
      fromClass: ClientDTO.fromClass,
      req,
      res,
      alias: 'client'
    });
  }
}

const registerInstance = new IClientRegisterController();

export const ClientRegisterController = registerInstance;

class IClientLoginController extends BaseController {
  protected service: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    return clientLogin({
      service: this.service,
      controller: this,
      fromJson: ClientDTO.fromJson,
      fromClass: ClientDTO.fromClass,
      req,
      res
    });
  }
}

const loginInstance = new IClientLoginController();

export const ClientLoginController = loginInstance;

class IClientUpdateController extends BaseController {
  protected service: ClientService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new ClientService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    return clientUpdate({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      req,
      res
    });
  }
}

const updateInstance = new IClientUpdateController();

export const ClientUpdateController = updateInstance;
