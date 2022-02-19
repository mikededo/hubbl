import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { TrainerTagDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { PersonService, TrainerTagService } from '../../services';
import BaseController from '../Base';

class ITrainerTagFetchController extends BaseController {
  private service: TrainerTagService = undefined;
  private personService: PersonService = undefined;

  private async onFail(res: Response, error: any): Promise<Response> {
    log.error(
      `Controller[${this.constructor.name}]`,
      `"fetch" handler`,
      error.toString()
    );

    return this.fail(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  }

  protected async run(_: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new TrainerTagService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.forbidden(res, 'User does not have permissions.');
    }

    // Get the gym of the person
    try {
      // Check if the person exists
      // Get the person, if any
      const person = await this.personService.findOne({
        id: token.id,
        options: { select: ['id', 'gym'] }
      });

      if (!person) {
        return this.unauthorized(res, 'Person does not exist.');
      }

      // Fetch the tags
      const tags = await this.service.find({
        where: { gym: (person.gym as Gym).id }
      });

      return this.ok(
        res,
        tags.map((tag) => TrainerTagDTO.fromClass(tag))
      );
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchnstance = new ITrainerTagFetchController();

export const TrainerTagFetchController = fetchnstance;
