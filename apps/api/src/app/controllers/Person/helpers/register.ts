import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

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
  returnName: string;
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
  returnName
}: BaseRegisterProps<T, J>): Promise<any> => {
  try {
    // Get the person and validate it
    const person = await fromJson(req.body, PersonDTOGroups.REGISTER);

    try {
      // Save the person
      const result = await service.save(await person.toClass());

      // Create the token
      const token = sign(
        { id: result.person.id, email: result.person.email },
        process.env.NX_JWT_TOKEN,
        { expiresIn: '10m' }
      );

      res.setHeader('Set-Cookie', `__hubbl-refresh__=${token}; HttpOnly`);
      return controller.created(res, {
        token,
        [returnName]: await fromClass(result)
      });
    } catch (_) {
      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team.'
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
        trainer: await fromClass(result)
      });
    } catch (_) {
      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team.'
      );
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};
