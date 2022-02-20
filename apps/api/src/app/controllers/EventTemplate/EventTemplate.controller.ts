import { Request, Response } from 'express';
import * as log from 'npmlog';

import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService, PersonService } from '../../services';
import BaseController, {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import { getRepository } from 'typeorm';
import { Gym } from '@hubbl/shared/models/entities';

class IEventTemplateFetchController extends BaseController {
  protected service: EventTemplateService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventTemplateService(getRepository);
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

      const gymId = (person.gym as Gym).id;

      const result = await this.service
        .createQueryBuilder({ alias: 'evTpl' })
        .loadRelationCountAndMap('evTpl.eventCount', 'evTpl.events', 'event')
        // Join the type
        .leftJoinAndSelect('evTpl.type', 'event_type')
        .where('evTpl.gym = :gym', { gym: gymId })
        .getMany();

      return this.ok(
        res,
        result.map((et) => {
          // Needs to be added as the find query does not parse the gym id
          et.gym = gymId;

          return EventTemplateDTO.fromClass(et);
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
  }
}

const fetchInstance = new IEventTemplateFetchController();

export const EventTemplateFetchController = fetchInstance;

const createInstance = new CreateByOwnerWorkerController(
  EventTemplateService,
  EventTemplateDTO.fromJson,
  EventTemplateDTO.fromClass,
  'EventTemplate',
  'createEventTemplates'
);

export const EventTemplateCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  EventTemplateService,
  EventTemplateDTO.fromJson,
  'EventTemplate',
  'updateEventTemplates'
);

export const EventTemplateUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  EventTemplateService,
  'EventTemplate',
  'deleteEventTemplates'
);

export const EventTemplateDeleteController = deleteInstance;
