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
import { trainerRegister } from './helpers';
import camelcaseKeys = require('camelcase-keys');

class ITrainerFetchController extends BaseController {
  protected service: TrainerService = undefined;
  protected personService: PersonService = undefined;

  private parseFk(key: string): string {
    return /_fk$/.test(key) ? key.split(/_fk$/)[0] : key;
  }

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

      try {
        /**
         * Due to a typeorm limitation, the leftJoinAndSelect skips the person
         * from the Trainer and it has to be obtained using the getRawMany, in
         * order to parse them afterwards
         */
        const result = await this.service
          .createQueryBuilder({ alias: 't' })
          .leftJoinAndSelect('person', 'p')
          .where('p.gym = :gymId', { gymId: (person.gym as Gym).id })
          .andWhere('t.trainer_person_fk = p.id')
          .skip(+(skip ?? 0))
          .limit(25)
          .getRawMany();

        return this.ok(
          res,
          result.map((t) => {
            const parsed = { person: {} };

            Object.entries(t).forEach(([k, v]) => {
              if (/^t_/.test(k)) {
                const [, prop] = k.split(/^t_/);
                parsed[this.parseFk(prop)] = v;
              } else if (/^p_/.test(k)) {
                const [, prop] = k.split(/^p_/);
                parsed.person[this.parseFk(prop)] = v;
              }
            });

            return TrainerDTO.fromClass(
              camelcaseKeys(parsed, { deep: true }) as any
            );
          })
        );
      } catch (e) {
        return this.onFail(res, e);
      }
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchInstance = new ITrainerFetchController();

export const TrainerFetchController = fetchInstance;

class ITrainerRegisterController extends BaseController {
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

const registerInstance = new ITrainerRegisterController();

export const TrainerRegisterController = registerInstance;

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
