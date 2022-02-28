import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import * as log from 'npmlog';

import {
  ClientDTO,
  OwnerDTO,
  PersonDTOGroups,
  TrainerDTO,
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

type RegisterableEntities = Owner | Worker | Client;

type RegisterableAliases = 'owner' | 'worker' | 'client';

type RegisterableDTOs =
  | OwnerDTO<Gym | number>
  | WorkerDTO<Gym | number>
  | ClientDTO<Gym | number>;

type BaseRegisterProps<
  T extends BaseService<RegisterableEntities>,
  J extends RegisterableDTOs
> = {
  service: T;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<J>;
  fromClass: BaseFromClassCallable<RegisterableEntities, J>;
  req: Request;
  res: Response;
  alias: RegisterableAliases;
};

export const register = async <
  T extends BaseService<RegisterableEntities>,
  J extends RegisterableDTOs
>({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res,
  alias
}: BaseRegisterProps<T, J>): Promise<any> => {
  try {
    // Get the person and validate it
    const person = await fromJson(req.body, PersonDTOGroups.REGISTER);

    try {
      // Save the person
      const result = await service.save(await person.toClass());

      // Create the tokens
      const tempToken = sign(
        { id: result.person.id, email: result.person.email, user: alias },
        process.env.NX_JWT_TOKEN,
        { expiresIn: '15m' }
      );

      if (!req.cookies['__hubbl-refresh__']) {
        const cookieToken = sign(
          { id: result.person.id, email: result.person.email, user: alias },
          process.env.NX_JWT_TOKEN,
          { expiresIn: '30d' }
        );
        res.setHeader(
          'Set-Cookie',
          `__hubbl-refresh__=${cookieToken}; SameSite=None; Secure; HttpOnly`
        );
      }

      return controller.created(res, {
        token: tempToken,
        [alias]: fromClass(result)
      });
    } catch (_) {
      log.error(
        `Controller [${controller.constructor.name}]`,
        '"register" handler',
        _.toString()
      );

      return controller.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

type TrainerRegisterProps = {
  service: BaseService<Trainer>;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<TrainerDTO<Gym | number>>;
  fromClass: BaseFromClassCallable<Trainer, TrainerDTO<Gym | number>>;
  req: Request;
  res: Response;
};

export const trainerRegister = async ({
  service,
  controller,
  fromJson,
  fromClass,
  req,
  res
}: TrainerRegisterProps): Promise<Response> => {
  try {
    // Get the person and validate it
    const person = await fromJson(req.body, PersonDTOGroups.REGISTER);

    try {
      // Save the person
      const result = await service.save(await person.toClass());

      return controller.created(res, {
        trainer: fromClass(result)
      });
    } catch (_) {
      log.error(
        `Controller [${controller.constructor.name}]`,
        '"register" handler',
        _.toString()
      );

      return controller.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};
