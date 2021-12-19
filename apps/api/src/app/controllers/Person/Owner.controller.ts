import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { RegisterOwnerDTO } from '@gymman/shared/models/dto';

import { OwnerService } from '../../services';
import BaseController from '../Base';

export class OwnerRegisterController extends BaseController {
  protected service: OwnerService = undefined;

  protected async run(req: Request, res: Response): Promise<any> {
    if (!this.service) {
      this.service = new OwnerService(getRepository);
    }

    try {
      // Get the owner and validate it
      const owner = await RegisterOwnerDTO.fromJson(req.body, 'register');
      // Save the owner
      try {
        const result = await this.service.save(await owner.toClass());

        // Create the token
        const token = sign(
          { id: result.person.id, email: result.person.email },
          process.env.JWT_TOKEN
        );

        res.setHeader('Set-Cookie', `__gym-man-refresh__=${token}; HttpOnly`);
        return this.created(res, {
          token,
          owner: await RegisterOwnerDTO.fromClass(result)
        });
      } catch (_) {
        return this.fail(
          res,
          'Internal server error. If the error persists, contact our team.'
        );
      }
    } catch (e) {
      return BaseController.jsonResponse(res, 400, e);
    }
  }
}
