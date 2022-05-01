import { Response } from 'express';
import * as log from 'npmlog';

import { Person } from '@hubbl/shared/models/entities';

import { GymZoneService, PersonService } from '../../services';
import BaseController from '../Base';

type UserAccessToCalendarProps = {
  controller: BaseController;
  personService: PersonService;
  gymZoneService: GymZoneService;
  res: Response;
  personId: number;
  calendarId: number;
};

const onFail = async (
  res: Response,
  controller: BaseController,
  error: any
): Promise<Response> => {
  log.error(
    `Controller [${controller.constructor.name}]`,
    '[Calendar access validation]',
    error.toString()
  );

  return controller.fail(
    res,
    'Internal server error. If the problem persists, contact our team.'
  );
};

/**
 * It first checks that the person from with the `personId`
 * exists in the `Person` entity. Once the person has been validated,
 * it checks that such person has access to the calendar with
 * the given `calendarId`
 */
export const userAccessToCalendar = async ({
  controller,
  personService,
  gymZoneService,
  res,
  personId,
  calendarId
}: UserAccessToCalendarProps): Promise<Response> | undefined => {
  // Check if person making the request exists
  let person: Person;
  try {
    person = await personService.findOne({
      where: { id: personId },
      loadRelationIds: true
    });
    if (!person) {
      return controller.unauthorized(res, 'Person does not exist.');
    }
  } catch (e) {
    return onFail(res, controller, e);
  }

  // Validate that is fetching a calendar from a gym zone
  // to which they have access
  try {
    const count = await gymZoneService
      .createQueryBuilder({ alias: 'gz' })
      .where('gz.calendar = :calendarId', { calendarId })
      .andWhere('gym.id = :gymId', { gymId: person.gym })
      .andWhere('p.id = :personId', { personId: person.id })
      .innerJoin('gz.virtualGym', 'vg')
      .innerJoin('vg.gym', 'gym')
      .innerJoin(Person, 'p')
      .getCount();

    if (!count) {
      return controller.forbidden(
        res,
        'Client does not have access to the chosen calendar.'
      );
    }
  } catch (e) {
    return onFail(res, controller, e);
  }
};
