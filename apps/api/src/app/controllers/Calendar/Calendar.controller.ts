import * as camelCaseKeys from 'camelcase-keys';
import { Request, Response } from 'express';
import * as log from 'npmlog';

import { EventDTO } from '@hubbl/shared/models/dto';

import {
  CalendarAppointmentService,
  EventAppointmentService,
  EventService,
  GymZoneService,
  PersonService
} from '../../services';
import BaseController from '../Base';
import { userAccessToCalendar } from '../helpers';
import { Gym, Person } from '@hubbl/shared/models/entities';

abstract class CalendarFetchBase extends BaseController {
  protected gymZoneService: GymZoneService = undefined;
  protected personService: PersonService = undefined;

  protected checkServices() {
    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService();
    }

    if (!this.personService) {
      this.personService = new PersonService();
    }
  }

  protected validDate(
    year: number,
    month: number,
    day: number
  ): Date | undefined {
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return undefined;
    }

    return date;
  }

  protected async onFail(res: Response, error: any): Promise<Response> {
    log.error(
      `Controller [${this.constructor.name}]`,
      '"fetch" handler',
      error.toString()
    );

    return this.fail(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  }
}

class ICalendarFetchEventsController extends CalendarFetchBase {
  protected eventService: EventService = undefined;

  private parseParamDate(paramDate: string): [Date, Date] | undefined {
    if (!paramDate) {
      return undefined;
    }

    if (!paramDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return undefined;
    }

    const [year, month, day] = paramDate.split('-');
    const date = this.validDate(+year, +month, +day);
    if (!date) {
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
    this.checkServices();

    if (!this.eventService) {
      this.eventService = new EventService();
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
        .innerJoinAndSelect('e.trainer', 't')
        .innerJoinAndSelect('t.person', 'p')
        .innerJoinAndSelect('e.eventType', 'tt')
        .leftJoinAndSelect('e.template', 'tpl')
        .loadRelationCountAndMap(
          'e.appointmentCount',
          'e.appointments',
          'ea',
          (qb) => qb.where('ea.cancelled = false')
        )
        .orderBy({
          'e.date.year': 'ASC',
          'e.date.month': 'ASC',
          'e.date.day': 'ASC',
          'e.startTime': 'ASC'
        })
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

class ICalendarFetchEventAppointmentsController extends CalendarFetchBase {
  protected eventAppointmentService: EventAppointmentService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    if (!this.eventAppointmentService) {
      this.eventAppointmentService = new EventAppointmentService();
    }

    const { token } = res.locals;
    const calendarId = +req.params.id;
    const eventId = +req.params.eId;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(
        res,
        'User can not get the list of event appointments.'
      );
    }

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

    try {
      const result = await this.eventAppointmentService
        .createQueryBuilder({ alias: 'ea' })
        .select([
          'p.id as id',
          'p.firstName as first_name',
          'p.lastName as last_name',
          'p.email as email',
          'c.covidPassport as covid_passport',
          'ea.cancelled as cancelled'
        ])
        .where('ea.event = :eventId', { eventId })
        .innerJoin('ea.client', 'c')
        .innerJoin('c.person', 'p', 'ea.client = p.id')
        .getRawMany();

      return this.ok(
        res,
        result.map((item) => camelCaseKeys(item))
      );
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchEventAppointmentsInstance =
  new ICalendarFetchEventAppointmentsController();

export const CalendarFetchEventAppointmentsController =
  fetchEventAppointmentsInstance;

class ICalendarFetchCalenAppointmentsController extends CalendarFetchBase {
  protected calenAppointmentService: CalendarAppointmentService = undefined;

  private parseParamDate(paramDate: string): Date | undefined {
    if (!paramDate) {
      return undefined;
    }

    if (!paramDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return undefined;
    }

    const [year, month, day] = paramDate.split('-');
    const date = this.validDate(+year, +month, +day);
    if (!date) {
      return undefined;
    }

    return date;
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    if (!this.calenAppointmentService) {
      this.calenAppointmentService = new CalendarAppointmentService();
    }

    const { token } = res.locals;
    const calendarId = +req.params.id;

    if (token.user !== 'owner' && token.user !== 'worker') {
      return this.forbidden(
        res,
        'User can not get the list of calendar appointments.'
      );
    }

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

    const date = this.parseParamDate(req.query.date as string);
    if (!date) {
      return this.clientError(res, 'Query param "date" not set or invalid.');
    }

    try {
      const result = await this.calenAppointmentService
        .createQueryBuilder({ alias: 'ca' })
        .select([
          'p.id as id',
          'p.firstName as first_name',
          'p.lastName as last_name',
          'p.email as email',
          'c.covidPassport as covid_passport',
          'ca.id as appointment_id',
          'ca.startTime as start_time',
          'ca.endTime as end_time',
          'ca.cancelled as cancelled'
        ])
        .where('ca.date.year = :year', { year: date.getFullYear() })
        .andWhere('ca.date.month = :month', { month: date.getMonth() + 1 })
        .andWhere('ca.date.day = :day', { day: date.getDate() })
        .innerJoin('ca.client', 'c')
        .innerJoin('c.person', 'p', 'ca.client = p.id')
        .getRawMany();

      return this.ok(
        res,
        result.map((item) => camelCaseKeys(item))
      );
    } catch (e) {
      return this.onFail(res, e);
    }
  }
}

const fetchCalenAppointmentsInstance =
  new ICalendarFetchCalenAppointmentsController();

export const CalendarFetchCalenAppointmentsController =
  fetchCalenAppointmentsInstance;

class ICalendarFetchTodayEventsController extends BaseController {
  protected eventService: EventService = undefined;
  protected personService: PersonService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.eventService) {
      this.eventService = new EventService();
    }

    if (!this.personService) {
      this.personService = new PersonService();
    }

    const { token } = res.locals;

    let person: Person;
    try {
      // Search for the person
      person = await this.personService.findOneBy({ id: token.id });

      if (!person) {
        return this.clientError(res, 'Person does not exist.');
      }
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }

    try {
      // Find the events of the gym
      const today = new Date();
      const result = await this.eventService
        .createQueryBuilder({ alias: 'e' })
        .where('e.gym.id = :gymId', { gymId: (person.gym as Gym).id })
        .andWhere('e.date.year = :year', { year: today.getFullYear() })
        .andWhere('e.date.month = :month', { month: today.getMonth() + 1 })
        .andWhere('e.date.day = :day', { day: today.getDate() })
        .loadAllRelationIds({ relations: ['date', 'calendar'] })
        .innerJoinAndSelect('e.trainer', 't')
        .innerJoinAndSelect('t.person', 'p')
        .innerJoinAndSelect('e.eventType', 'tt')
        .innerJoinAndSelect('e.template', 'tpl')
        .loadRelationCountAndMap(
          'e.appointmentCount',
          'e.appointments',
          'ea',
          (qb) => qb.where('ea.cancelled = false')
        )
        .orderBy({
          'e.date.year': 'ASC',
          'e.date.month': 'ASC',
          'e.date.day': 'ASC',
          'e.startTime': 'ASC'
        })
        .cache(true)
        .getMany();

      return this.ok(
        res,
        result.map((et) => EventDTO.fromClass(et))
      );
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchTodayEventsInstance = new ICalendarFetchTodayEventsController();

export const CalendarFetchTodayEventsController = fetchTodayEventsInstance;
