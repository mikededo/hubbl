import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import {
  ClientDTO,
  OwnerDTO,
  PersonDTOGroups,
  TrainerDTO,
  WorkerDTO
} from '@gymman/shared/models/dto';
import {
  Client,
  Gym,
  Owner,
  Trainer,
  Worker
} from '@gymman/shared/models/entities';

import BaseService from '../../services/Base';
import BaseController from '../Base';
import {
  BasePersonFromClassCallable,
  BasePersonFromJsonCallable
} from './types';

type RegisterableEntities = Owner | Worker | Trainer | Client;

type RegisterableDTOs =
  | OwnerDTO<Gym | number>
  | WorkerDTO<Gym | number>
  | TrainerDTO<Gym | number>
  | ClientDTO<Gym | number>;

type RegisterProps<
  T extends BaseService<RegisterableEntities>,
  J extends RegisterableDTOs
> = {
  service: T;
  controller: BaseController;
  fromJson: BasePersonFromJsonCallable<J>;
  fromClass: BasePersonFromClassCallable<RegisterableEntities, J>;
  req: Request;
  res: Response;
  returnName: string;
};

const register = async <
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
}: RegisterProps<T, J>): Promise<any> => {
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

      res.setHeader('Set-Cookie', `__gym-man-refresh__=${token}; HttpOnly`);
      return controller.created(res, {
        token,
        [returnName]: await fromClass(result, new Gym())
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

export default register;
