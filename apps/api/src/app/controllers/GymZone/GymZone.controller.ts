import { Request, Response } from 'express';

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
      this.service = new GymZoneService();
    }

    if (!this.personService) {
      this.personService = new PersonService();
    }

    const { token } = res.locals;

    try {
      const person = await this.personService.findOneBy({ id: token.id });

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      try {
        const result = await this.service
          .createQueryBuilder({ alias: 'gymZone' })
          .innerJoinAndSelect('gymZone.calendar', 'calendar')
          .innerJoinAndSelect(
            'gymZone.virtualGym',
            'virtualGym',
            'virtualGym.id = :id',
            { id: req.params.vgId }
          )
          .innerJoin('virtualGym.gym', 'gym', 'gym.id = :id', {
            id: (person.gym as Gym).id
          })
          .getMany();

        return this.ok(res, result.map(GymZoneDTO.fromClass));
      } catch (e) {
        return this.onFail(res, e, 'fetch');
      }
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchInstance = new IGymZoneFetchController();

export const GymZoneFetchController = fetchInstance;

class IGymZoneFetchSingleController extends BaseController {
  protected service: GymZoneService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new GymZoneService();
    }

    if (!this.personService) {
      this.personService = new PersonService();
    }

    const { token } = res.locals;

    try {
      const person = await this.personService.findOneBy({ id: token.id });

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      try {
        const result = await this.service
          .createQueryBuilder({ alias: 'gymZone' })
          .innerJoinAndSelect('gymZone.calendar', 'calendar')
          .innerJoinAndSelect(
            'gymZone.virtualGym',
            'virtualGym',
            'virtualGym.id = :id',
            { id: req.params.vgId }
          )
          .innerJoin('virtualGym.gym', 'gym', 'gym.id = :id', {
            id: (person.gym as Gym).id
          })
          .where('gymZone.id = :id', { id: req.params.id })
          .getOne();

        return this.ok(res, GymZoneDTO.fromClass(result));
      } catch (e) {
        return this.onFail(res, e, 'fetch');
      }
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchSingleInstance = new IGymZoneFetchSingleController();

export const GymZoneFetchSingleController = fetchSingleInstance;

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
