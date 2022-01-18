import * as log from 'npmlog';

import { Response, Request } from 'express';

import { EventDTO } from '@hubbl/shared/models/dto';
import { EventService, GymZoneService, PersonService } from '../../services';
import BaseController from '../Base';
import { getRepository } from 'typeorm';
import { userAccessToCalendar } from '../helpers';

class ICalendarFetchEventsController extends BaseController {
  protected gymZoneService: GymZoneService = undefined;
  protected personService: PersonService = undefined;
  protected eventService: EventService = undefined;

  private onFail(res: Response, error: any): Response {
    log.error(
      `Controller[${this.constructor.name}]`,
      '"fetch" handler',
      error.toString()
    );

    return this.fail(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  }

  private parseParamDate(paramDate: string): [Date, Date] | undefined {
    if (!paramDate) {
      return undefined;
    }

    if (!paramDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return undefined;
    }

    const [year, month, day] = paramDate.split('-');
    const date = new Date(+year, +month - 1, +day);
    if (
      date.getFullYear() !== +year ||
      date.getMonth() !== +month - 1 ||
      date.getDate() !== +day
    ) {
      return undefined;
    }

    // Return this and next date
    const next = new Date(date.valueOf());
    // Paginate week by week
    next.setDate(next.getDate() + 6);

    return [date, next];
  }

  private toDateWithToChar(year: string, month: string, day: string): string {
    return `TO_DATE(TO_CHAR(${year}, '9999') || TO_CHAR(${month}, '00') || TO_CHAR(${day}, '00'), 'YYYYMMDD')`;
  }

  private toDateWithString(year: string, month: string, day: string): string {
    return `TO_DATE(${year} || ${month} || ${day}, 'YYYYMMDD')`;
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    if (!this.eventService) {
      this.eventService = new EventService(getRepository);
    }

    const { token } = res.locals;
    const calendarId = +req.params.id;

    const validation = await userAccessToCalendar({
      controller: this,
      personService: this.personService,
      gymZoneService: this.gymZoneService,
      res,
      personId: token.id,
      calendarId
    });
    if (validation) {
      return validation;
    }

    const dateRange = this.parseParamDate(req.query.startDate as string);
    if (!dateRange) {
      return this.clientError(
        res,
        'Query param "startDate" not set or invalid.'
      );
    }

    try {
      const [start, end] = dateRange;

      // Find all the events for the calendar
      const result = await this.eventService
        .createQueryBuilder({
          alias: 'e'
        })
        .where('e.calendar = :calendarId', { calendarId })
        .andWhere(
          [
            this.toDateWithToChar('e.date.year', 'e.date.month', 'e.date.day'),
            'BETWEEN',
            this.toDateWithString(':sYear', ':sMonth', ':sDay'),
            'AND',
            this.toDateWithString(':eYear', ':eMonth', ':eDay')
          ].join(' '),
          {
            sYear: `${start.getFullYear()}`,
            sMonth: `${start.getMonth() + 1}`.padStart(2, '0'),
            sDay: `${start.getDate()}`.padStart(2, '0'),
            eYear: `${end.getFullYear()}`,
            eMonth: `${end.getMonth() + 1}`.padStart(2, '0'),
            eDay: `${end.getDate()}`.padStart(2, '0')
          }
        )
        .loadAllRelationIds({ relations: ['date', 'calendar'] })
        .leftJoinAndSelect('e.trainer', 't')
        .leftJoinAndSelect('t.person', 'p')
        .loadRelationCountAndMap(
          'e.appointmentCount',
          'e.appointments',
          'ea',
          (qb) => qb.where('ea.cancelled = false')
        )
        .getMany();

      return this.ok(
        res,
        result.map((et) => EventDTO.fromClass(et))
      );
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchEventsInstance = new ICalendarFetchEventsController();

export const CalendarFetchEventsController = fetchEventsInstance;
