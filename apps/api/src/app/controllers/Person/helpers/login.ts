import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as log from 'npmlog';

import {
  ClientDTO,
  OwnerDTO,
  PersonDTOGroups,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import {
  Client,
  Gym,
  Owner,
  Trainer,
  Worker
} from '@hubbl/shared/models/entities';

import { BaseService } from '../../../services';
import BaseController from '../../Base';
import {
  BaseFromClassCallable,
  BasePersonFromJsonCallable
} from '../../helpers';

type LoggableEntities = Owner | Worker | Trainer | Client;

type LoggableAliases = 'owner' | 'worker' | 'trainer' | 'client';

type LoggableDTOs =
  | OwnerDTO<Gym | number>
  | WorkerDTO<Gym | number>
  | ClientDTO<Gym | number>;

type BaseLoginProps = {
  service: BaseService<LoggableEntities>;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<LoggableDTOs>;
  fromClass: BaseFromClassCallable<LoggableEntities, LoggableDTOs>;
  req: Request;
  res: Response;
  alias: LoggableAliases;
};

export const login = async ({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res,
  alias
}: BaseLoginProps): Promise<any> => {
  try {
    // Get the entity
    const entityDTO = await fromJson(req.body, PersonDTOGroups.LOGIN);

    try {
      // Find the entity
      const entityFound = await service
        .createQueryBuilder({ alias })
        .leftJoinAndSelect(`${alias}.person`, 'person')
        .leftJoinAndSelect('person.gym', 'gym')
        .where('person.email = :email', { email: entityDTO.email })
        .getOne();

      if (!entityFound) {
        return controller.fail(res, 'Email not found');
      }

      if (!(await compare(entityDTO.password, entityFound.person.password))) {
        return controller.unauthorized(res, 'Passwords do not match');
      }

      // Create token
      const token = sign(
        {
          id: entityFound.person.id,
          email: entityFound.person.email,
          user: alias
        },
        process.env.NX_JWT_TOKEN,
        { expiresIn: '15m' }
      );

      res.setHeader('Set-Cookie', `__hubbl-refresh__=${token}; HttpOnly`);

      // Join with the entity data
      return controller.ok(res, {
        token,
        entity: fromClass(entityFound)
      });
    } catch (_) {
      log.error(
        `Controller[${controller.constructor.name}]`,
        '"login" handler',
        _.toString()
      );

      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team.'
      );
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

type OwnerLoginProps = {
  service: BaseService<Owner>;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<OwnerDTO<Gym | number>>;
  fromClass: BaseFromClassCallable<Owner, OwnerDTO<Gym | number>>;
  req: Request;
  res: Response;
};

/**
 * If the given email and password are corrects, will return the
 * logged owner and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the owner dto
 * @param fromClass FromClass mapper of the owner dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const ownerLogin = async ({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res
}: OwnerLoginProps): Promise<any> =>
  login({ service, controller, fromJson, fromClass, req, res, alias: 'owner' });

type WorkerLoginProps = {
  service: BaseService<Worker>;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<WorkerDTO<Gym | number>>;
  fromClass: BaseFromClassCallable<Worker, WorkerDTO<Gym | number>>;
  req: Request;
  res: Response;
};

/**
 * If the given email and password are corrects, will return the
 * logged worker and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the worker dto
 * @param fromClass FromClass mapper of the worker dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const workerLogin = async ({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res
}: WorkerLoginProps): Promise<any> =>
  login({
    service,
    controller,
    fromJson,
    fromClass,
    req,
    res,
    alias: 'worker'
  });

type ClientLoginProps = {
  service: BaseService<Client>;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<ClientDTO<Gym | number>>;
  fromClass: BaseFromClassCallable<Client, ClientDTO<Gym | number>>;
  req: Request;
  res: Response;
};

/**
 * If the given email and password are corrects, will return the
 * logged client and the token
 *
 * @param service The login service
 * @param controller Controller to send the responses
 * @param fromJson FromJson mapper of the client dto
 * @param fromClass FromClass mapper of the client dto
 * @param req Request of the http request
 * @param res Response of the http request
 */
export const clientLogin = async ({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res
}: ClientLoginProps): Promise<any> =>
  login({
    service,
    controller,
    fromJson,
    fromClass,
    req,
    res,
    alias: 'client'
  });
