import { Request, Response } from 'express';
import * as log from 'npmlog';

import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { getRepository } from '../../../config';
import { EventTypeService, PersonService } from '../../services';
import BaseController, {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';

class IEventTypeFetchController extends BaseController {
  protected service: EventTypeService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventTypeService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    const { token } = res.locals;

    try {
      const person = await this.personService.findOneBy({ id: token.id });

      if (!person) {
        return this.clientError(res, 'Person does not exist');
      }

      try {
        const gymId = (person.gym as Gym).id;

        const result = await this.service.find({
          where: { gym: gymId }
        });

        return this.ok(
          res,
          result.map((ev) => {
            // Needs to be added as the find query does not parse the gym id
            ev.gym = gymId;

            return EventTypeDTO.fromClass(ev);
          })
        );
      } catch (_) {
        log.error(
          `Controller [${this.constructor.name}]`,
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
        `Controller [${this.constructor.name}]`,
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

const fetchInstance = new IEventTypeFetchController();

export const EventTypeFetchController = fetchInstance;

const createInstance = new CreateByOwnerWorkerController(
  EventTypeService,
  EventTypeDTO.fromJson,
  EventTypeDTO.fromClass,
  'EventType',
  'createEventTypes'
);

export const EventTypeCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  EventTypeService,
  EventTypeDTO.fromJson,
  'EventType',
  'updateEventTypes'
);

export const EventTypeUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  EventTypeService,
  'EventType',
  'deleteEventTypes'
);

export const EventTypeDeleteController = deleteInstance;
