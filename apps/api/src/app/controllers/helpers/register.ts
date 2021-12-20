import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { PersonDTOVariants, OwnerDTO } from '@gymman/shared/models/dto';
import { Gym, Owner } from '@gymman/shared/models/entities';

import BaseService from '../../services/Base';
import BaseController from '../Base';

type BasePersonFromJsonCallable<T> = (
  json: any,
  variant: PersonDTOVariants
) => Promise<T>;

type OwnerFromJsonCallable = BasePersonFromJsonCallable<OwnerDTO<Gym | number>>;

type BasePersonToClassCallable<J, T> = (entity: J) => Promise<T>;

type OwnerFromClassCallable = BasePersonToClassCallable<Owner, OwnerDTO<Gym>>;

type RegisterFromJsonCallables = OwnerFromJsonCallable;

type RegisetrFromClassCallables = OwnerFromClassCallable;

const register = async <T extends BaseService<Owner>>(
  service: T,
  controller: BaseController,
  fromJson: RegisterFromJsonCallables,
  fromClass: RegisetrFromClassCallables,
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Get the person and validate it
    const person = await fromJson(req.body, PersonDTOVariants.REGISTER);

    try {
      // Save the person
      const result = await service.save(await person.toClass());

      // Create the token
      const token = sign(
        { id: result.person.id, email: result.person.email },
        process.env.JWT_TOKEN
      );

      res.setHeader('Set-Cookie', `__gym-man-refresh__=${token}; HttpOnly`);
      return controller.created(res, {
        token,
        owner: await fromClass(result)
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
