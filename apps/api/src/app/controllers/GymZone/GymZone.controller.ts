import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { GymZoneService, PersonService } from '../../services';
import BaseController, {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';

class IGymZoneFetchController extends BaseController {
  protected service: GymZoneService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new GymZoneService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;

    try {
      const person = await this.personService.findOne({ id: token.id });

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      try {
        const result = await this.service
          .createQueryBuilder({ alias: 'gymZone' })
          .leftJoinAndSelect('gymZone.calendar', 'calendar')
          .leftJoinAndSelect(
            'gymZone.virtualGym',
            'virtualGym',
            'virtualGym.id = :id',
            { id: req.params.vgId }
          )
          .leftJoin('virtualGym.gym', 'gym', 'gym.id = :id', {
            id: (person.gym as Gym).id
          })
          .getMany();

        return this.ok(
          res,
          await Promise.all(result.map(GymZoneDTO.fromClass))
        );
      } catch (_) {
        log.error(
          `Controller[${this.constructor.name}]`,
          '"fetch" handler',
          _.toString()
        );

        return this.fail(
          res,
          'Internal server error. If the problem persists, contact our team.'
        );
      }
    } catch (_) {
      log.error(
        `Controller[${this.constructor.name}]`,
        '"fetch" handler',
        _.toString()
      );

      return this.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }
  }
}

const fetchInstance = new IGymZoneFetchController();

export const GymZoneFetchController = fetchInstance;

const createInstance = new CreateByOwnerWorkerController(
  GymZoneService,
  GymZoneDTO.fromJson,
  GymZoneDTO.fromClass,
  'GymZone',
  'createGymZones'
);

export const GymZoneCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  GymZoneService,
  GymZoneDTO.fromJson,
  'GymZone',
  'updateGymZones'
);

export const GymZoneUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  GymZoneService,
  'GymZone',
  'deleteGymZones'
);

export const GymZoneDeleteController = deleteInstance;
