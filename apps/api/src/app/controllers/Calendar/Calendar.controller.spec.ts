import * as camelCaseKeys from 'camelcase-keys';
import * as log from 'npmlog';

import { Event, Person, Trainer } from '@hubbl/shared/models/entities';

import {
  CalendarAppointmentService,
  EventAppointmentService,
  EventService,
  GymZoneService,
  PersonService
} from '../../services';
import * as validations from '../helpers/validations';
import {
  CalendarFetchCalenAppointmentsController,
  CalendarFetchEventAppointmentsController,
  CalendarFetchEventsController,
  CalendarFetchTodayEventsController
} from './Calendar.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

const createEvent = () => {
  const person: Person = new Person();
  const trainer: Trainer = new Trainer();
  const event: Event = new Event();

  person.id = 1;
  person.firstName = 'Test';
  person.lastName = 'Trainer';
  trainer.person = person;

  event.id = 2;
  event.calendar = 2;
  event.trainer = trainer;
  event.maskRequired = true;
  event.covidPassport = true;
  event.capacity = 10;
  event.startTime = '09:00:00';
  event.endTime = '10:00:00';
  event.appointmentCount = 5;
  event.template = 1;
  event.date = { year: 2022, month: 6, day: 29 } as any;
};

describe('Calendar controller', () => {
  const mockRes = { locals: { token: { id: 1, user: 'owner' } } } as any;
  const logSpy = jest.spyOn(log, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const failSpyAsserts = (failSpy: any) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  describe('CalendarFetchEventsController', () => {
    const eventList = [createEvent(), createEvent(), createEvent()];
    const mockReq = {
      params: { id: 2 },
      query: { startDate: '2022-06-29' },
      body: {},
      headers: { authorization: 'Any token' }
    } as any;

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      loadAllRelationIds: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const mockEventService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };

    const validationSpy = jest.spyOn(validations, 'userAccessToCalendar');
    const clientErrorSpy = jest.spyOn(
      CalendarFetchEventsController,
      'clientError'
    );

    beforeEach(() => {
      jest.clearAllMocks();

      clientErrorSpy.mockImplementation();
    });

    const setupServices = () => {
      CalendarFetchEventsController['gymZoneService'] = {} as any;
      CalendarFetchEventsController['personService'] = {} as any;
      CalendarFetchEventsController['eventService'] = mockEventService as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(CalendarFetchEventsController, 'fail').mockImplementation();

      CalendarFetchEventsController['gymZoneService'] = undefined;
      CalendarFetchEventsController['personService'] = undefined;
      CalendarFetchEventsController['eventService'] = undefined;

      await CalendarFetchEventsController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledTimes(1);
    });

    it('should return the list of events for the selected calendar', async () => {
      const mockEventList = {
        map: jest.fn().mockImplementation((cb: any) => {
          expect(cb).toBeDefined();

          return eventList.map(cb);
        })
      };
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getMany.mockResolvedValue(mockEventList);
      mockQueryBuilder.loadRelationCountAndMap
        .mockClear()
        .mockImplementation((paramOne, paramTwo, paramThree, cb) => {
          const mockQB = { where: jest.fn() };

          expect(paramOne).toBe('e.appointmentCount');
          expect(paramTwo).toBe('e.appointments');
          expect(paramThree).toBe('ea');

          expect(cb).toBeDefined();
          // Call the callback
          cb(mockQB);
          // Check if where is called
          expect(mockQB.where).toHaveBeenCalledTimes(1);
          expect(mockQB.where).toHaveBeenCalledWith('ea.cancelled = false');

          return mockQueryBuilder;
        });

      const okSpy = jest
        .spyOn(CalendarFetchEventsController, 'ok')
        .mockImplementation();

      setupServices();
      await CalendarFetchEventsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(validationSpy).toHaveBeenCalledWith({
        controller: CalendarFetchEventsController,
        personService: {},
        gymZoneService: {},
        res: mockRes,
        personId: mockRes.locals.token.id,
        calendarId: mockReq.params.id
      });
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'e.calendar = :calendarId',
        { calendarId: mockReq.params.id }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        [
          "TO_DATE(TO_CHAR(e.date.year, '9999') || TO_CHAR(e.date.month, '00') || TO_CHAR(e.date.day, '00'), 'YYYYMMDD')",
          'BETWEEN',
          "TO_DATE(:sYear || :sMonth || :sDay, 'YYYYMMDD')",
          'AND',
          "TO_DATE(:eYear || :eMonth || :eDay, 'YYYYMMDD')"
        ].join(' '),
        {
          sYear: '2022',
          sMonth: '06',
          sDay: '29',
          eYear: '2022',
          eMonth: '07',
          eDay: '05'
        }
      );
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledWith({
        relations: ['date', 'calendar']
      });
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'e.trainer',
        't'
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        't.person',
        'p'
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        3,
        'e.eventType',
        'tt'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'e.template',
        'tpl'
      );
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith({
        'e.date.year': 'ASC',
        'e.date.month': 'ASC',
        'e.date.day': 'ASC',
        'e.startTime': 'ASC'
      });
      expect(mockEventList.map).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, eventList);
    });

    it('should return if validation does not pass', async () => {
      validationSpy.mockResolvedValue('any' as any);

      setupServices();
      await CalendarFetchEventsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should send clientError if startDate not set', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchEventsController.execute(
        { ...mockReq, query: { ...mockReq, startDate: undefined } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "startDate" not set or invalid.'
      );
    });

    it('should send clientError if startDate has invalid format', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchEventsController.execute(
        { ...mockReq, query: { ...mockReq, startDate: '2022/02/30' } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "startDate" not set or invalid.'
      );
    });

    it('should send clientError if startDate invalid', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchEventsController.execute(
        { ...mockReq, query: { ...mockReq, startDate: '2022-02-30' } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "startDate" not set or invalid.'
      );
    });

    it('should call fail on getMany error', async () => {
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getMany.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(CalendarFetchEventsController, 'fail')
        .mockImplementation();

      setupServices();
      await CalendarFetchEventsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });
  });

  describe('CalendarFetchEventAppointmentsController', () => {
    const mockReq = {
      params: { id: 2, eId: 1 },
      query: { date: '2022-06-29' },
      body: {},
      headers: { authorization: 'Any token' }
    } as any;

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getRawMany: jest.fn()
    };
    const mockEvAppService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };

    const validationSpy = jest.spyOn(validations, 'userAccessToCalendar');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      CalendarFetchEventAppointmentsController['gymZoneService'] = {} as any;
      CalendarFetchEventAppointmentsController['personService'] = {} as any;
      CalendarFetchEventAppointmentsController['eventAppointmentService'] =
        mockEvAppService as any;
    };

    it('should create the services if does not have any', async () => {
      jest
        .spyOn(CalendarFetchEventAppointmentsController, 'fail')
        .mockImplementation();

      CalendarFetchEventAppointmentsController['gymZoneService'] = undefined;
      CalendarFetchEventAppointmentsController['personService'] = undefined;
      CalendarFetchEventAppointmentsController['eventService'] = undefined;

      await CalendarFetchEventAppointmentsController.execute(
        {} as any,
        {} as any
      );

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(EventAppointmentService).toHaveBeenCalledTimes(1);
    });

    it('should return the list of users with appointments', async () => {
      const queryResult = [
        {
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@any.com',
          covid_passport: true,
          cancelled: true
        }
      ];
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getRawMany.mockResolvedValue(queryResult);

      const okSpy = jest
        .spyOn(CalendarFetchEventAppointmentsController, 'ok')
        .mockImplementation();

      setupServices();
      await CalendarFetchEventAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(validationSpy).toHaveBeenCalledWith({
        controller: CalendarFetchEventAppointmentsController,
        personService: {},
        gymZoneService: {},
        res: mockRes,
        personId: mockRes.locals.token.id,
        calendarId: mockReq.params.id
      });
      // Query builder
      expect(mockEvAppService.createQueryBuilder).toBeCalledTimes(1);
      expect(mockEvAppService.createQueryBuilder).toBeCalledWith({
        alias: 'ea'
      });
      expect(mockQueryBuilder.select).toBeCalledTimes(1);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'p.id as id',
        'p.firstName as first_name',
        'p.lastName as last_name',
        'p.email as email',
        'c.covidPassport as covid_passport',
        'ea.cancelled as cancelled'
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'ea.event = :eventId',
        { eventId: mockReq.params.eId }
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.innerJoin).toHaveBeenNthCalledWith(
        1,
        'ea.client',
        'c'
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenNthCalledWith(
        2,
        'c.person',
        'p',
        'ea.client = p.id'
      );
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getRawMany).toHaveReturned();
      // Return the results
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, camelCaseKeys(queryResult));
    });

    it('should send forbidden if user is not owner nor worker', async () => {
      const mockRes = {
        locals: { token: { id: 1, user: 'client' } }
      } as any;
      const forbiddenSpy = jest.spyOn(
        CalendarFetchEventAppointmentsController,
        'forbidden'
      );

      setupServices();
      await CalendarFetchEventAppointmentsController.execute(mockReq, mockRes);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'User can not get the list of event appointments.'
      );
    });

    it('should return if validation does not pass', async () => {
      validationSpy.mockResolvedValue('any' as any);

      setupServices();
      await CalendarFetchEventAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockEvAppService.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should send fail on getRawMany error', async () => {
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getRawMany.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(CalendarFetchEventAppointmentsController, 'fail')
        .mockImplementation();

      setupServices();
      await CalendarFetchEventAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockEvAppService.createQueryBuilder).toBeCalledTimes(1);
      expect(mockQueryBuilder.select).toBeCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });
  });

  describe('CalendarFetchCalenAppointmentsController', () => {
    const mockReq = {
      params: { id: 2, eId: 1 },
      query: { date: '2022-06-29' },
      body: {},
      headers: { authorization: 'Any token' }
    } as any;

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getRawMany: jest.fn()
    };
    const mockCalAppService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };

    const validationSpy = jest.spyOn(validations, 'userAccessToCalendar');
    const clientErrorSpy = jest
      .spyOn(CalendarFetchCalenAppointmentsController, 'clientError')
      .mockImplementation();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      CalendarFetchCalenAppointmentsController['gymZoneService'] = {} as any;
      CalendarFetchCalenAppointmentsController['personService'] = {} as any;
      CalendarFetchCalenAppointmentsController['calenAppointmentService'] =
        mockCalAppService as any;
    };

    it('should create the services if does not have any', async () => {
      jest
        .spyOn(CalendarFetchCalenAppointmentsController, 'fail')
        .mockImplementation();

      CalendarFetchCalenAppointmentsController['gymZoneService'] = undefined;
      CalendarFetchCalenAppointmentsController['personService'] = undefined;
      CalendarFetchCalenAppointmentsController['eventService'] = undefined;

      await CalendarFetchCalenAppointmentsController.execute(
        {} as any,
        {} as any
      );

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(CalendarAppointmentService).toHaveBeenCalledTimes(1);
    });

    it('should return the list of users with appointments', async () => {
      const queryResult = [
        {
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@any.com',
          covid_passport: true,
          appointment_id: 1,
          start_time: '09:00:00',
          end_time: '10:00:00',
          cancelled: true
        }
      ];
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getRawMany.mockResolvedValue(queryResult);

      const okSpy = jest
        .spyOn(CalendarFetchCalenAppointmentsController, 'ok')
        .mockImplementation();

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(validationSpy).toHaveBeenCalledWith({
        controller: CalendarFetchCalenAppointmentsController,
        personService: {},
        gymZoneService: {},
        res: mockRes,
        personId: mockRes.locals.token.id,
        calendarId: mockReq.params.id
      });
      // Query builder
      expect(mockCalAppService.createQueryBuilder).toBeCalledTimes(1);
      expect(mockCalAppService.createQueryBuilder).toBeCalledWith({
        alias: 'ca'
      });
      expect(mockQueryBuilder.select).toBeCalledTimes(1);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        'p.id as id',
        'p.firstName as first_name',
        'p.lastName as last_name',
        'p.email as email',
        'c.covidPassport as covid_passport',
        'ca.id as appointment_id',
        'ca.startTime as start_time',
        'ca.endTime as end_time',
        'ca.cancelled as cancelled'
      ]);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'ca.date.year = :year',
        { year: +mockReq.query.date.split('-')[0] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'ca.date.month = :month',
        { month: +mockReq.query.date.split('-')[1] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'ca.date.day = :day',
        { day: +mockReq.query.date.split('-')[2] }
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.innerJoin).toHaveBeenNthCalledWith(
        1,
        'ca.client',
        'c'
      );
      expect(mockQueryBuilder.innerJoin).toHaveBeenNthCalledWith(
        2,
        'c.person',
        'p',
        'ca.client = p.id'
      );
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getRawMany).toHaveReturned();
      // Return the results
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, camelCaseKeys(queryResult));
    });

    it('should send forbidden if user is not owner nor worker', async () => {
      const mockRes = {
        locals: { token: { id: 1, user: 'client' } }
      } as any;
      const forbiddenSpy = jest.spyOn(
        CalendarFetchCalenAppointmentsController,
        'forbidden'
      );

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(mockReq, mockRes);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'User can not get the list of calendar appointments.'
      );
    });

    it('should return if validation does not pass', async () => {
      validationSpy.mockResolvedValue('any' as any);

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockCalAppService.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should send clientError if param date not given', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(
        { ...mockReq, query: { ...mockReq, date: undefined } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "date" not set or invalid.'
      );
    });

    it('should send clientError if param date has invalid format', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(
        { ...mockReq, query: { ...mockReq, date: '2022/06/29' } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "date" not set or invalid.'
      );
    });

    it('should send clientError if param date not given', async () => {
      validationSpy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(
        { ...mockReq, query: { ...mockReq, date: '2022-02-30' } },
        mockRes
      );

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Query param "date" not set or invalid.'
      );
    });

    it('should send fail on getRawMany error', async () => {
      validationSpy.mockResolvedValue(undefined);
      mockQueryBuilder.getRawMany.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(CalendarFetchCalenAppointmentsController, 'fail')
        .mockImplementation();

      setupServices();
      await CalendarFetchCalenAppointmentsController.execute(mockReq, mockRes);

      expect(validationSpy).toHaveBeenCalledTimes(1);
      expect(mockCalAppService.createQueryBuilder).toBeCalledTimes(1);
      expect(mockQueryBuilder.select).toBeCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });
  });

  describe('CalendarFetchTodayEventsController', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));

    const eventList = [createEvent(), createEvent(), createEvent()];
    const mockReq = { headers: { authorization: 'Any token' } } as any;

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      loadAllRelationIds: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      cache: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const mockEventService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };
    const mockPersonService = {
      findOneBy: jest.fn()
    };

    const clientErrorSpy = jest.spyOn(
      CalendarFetchTodayEventsController,
      'clientError'
    );

    beforeEach(() => {
      jest.clearAllMocks();

      clientErrorSpy.mockImplementation();
    });

    const setupServices = () => {
      CalendarFetchTodayEventsController['personService'] =
        mockPersonService as any;
      CalendarFetchTodayEventsController['eventService'] =
        mockEventService as any;
    };

    it('should create the services if does not have any', async () => {
      jest
        .spyOn(CalendarFetchTodayEventsController, 'fail')
        .mockImplementation();

      CalendarFetchTodayEventsController['personService'] = undefined;
      CalendarFetchTodayEventsController['eventService'] = undefined;

      await CalendarFetchTodayEventsController.execute({} as any, {} as any);

      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledTimes(1);
    });

    it('should return the list of today events', async () => {
      const mockEventList = {
        map: jest.fn().mockImplementation((cb: any) => {
          expect(cb).toBeDefined();

          return eventList.map(cb);
        })
      };
      mockPersonService.findOneBy.mockResolvedValue({ gym: { id: 1 } });

      mockQueryBuilder.getMany.mockResolvedValue(mockEventList);
      mockQueryBuilder.loadRelationCountAndMap
        .mockClear()
        .mockImplementation((paramOne, paramTwo, paramThree, cb) => {
          const mockQB = { where: jest.fn() };

          expect(paramOne).toBe('e.appointmentCount');
          expect(paramTwo).toBe('e.appointments');
          expect(paramThree).toBe('ea');

          expect(cb).toBeDefined();
          // Call the callback
          cb(mockQB);
          // Check if where is called
          expect(mockQB.where).toHaveBeenCalledTimes(1);
          expect(mockQB.where).toHaveBeenCalledWith('ea.cancelled = false');

          return mockQueryBuilder;
        });

      const okSpy = jest
        .spyOn(CalendarFetchTodayEventsController, 'ok')
        .mockImplementation();

      setupServices();
      await CalendarFetchTodayEventsController.execute(mockReq, mockRes);

      expect(mockPersonService.findOneBy).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('e.gym.id = :gymId', {
        gymId: 1
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'e.date.year = :year',
        { year: 2022 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'e.date.month = :month',
        { month: 6 }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        3,
        'e.date.day = :day',
        { day: 29 }
      );
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledWith({
        relations: ['date', 'calendar']
      });
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledTimes(4);
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'e.trainer',
        't'
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        't.person',
        'p'
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        3,
        'e.eventType',
        'tt'
      );
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenNthCalledWith(
        4,
        'e.template',
        'tpl'
      );
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith({
        'e.date.year': 'ASC',
        'e.date.month': 'ASC',
        'e.date.day': 'ASC',
        'e.startTime': 'ASC'
      });
      expect(mockQueryBuilder.cache).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.cache).toHaveBeenCalledWith(true);
      expect(mockEventList.map).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, eventList);
    });

    it('should send clientError person does not exist', async () => {
      mockPersonService.findOneBy.mockResolvedValue(undefined);

      setupServices();
      await CalendarFetchTodayEventsController.execute(mockReq, mockRes);

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist.'
      );
    });

    it('should call faill on person service error', async () => {
      mockPersonService.findOneBy.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(CalendarFetchTodayEventsController, 'fail')
        .mockImplementation();

      setupServices();
      await CalendarFetchTodayEventsController.execute(mockReq, mockRes);

      expect(mockPersonService.findOneBy).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });

    it('should call fail on getMany error', async () => {
      mockPersonService.findOneBy.mockResolvedValue({ gym: { id: 1 } });
      mockQueryBuilder.getMany.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(CalendarFetchTodayEventsController, 'fail')
        .mockImplementation();

      setupServices();
      await CalendarFetchTodayEventsController.execute(mockReq, mockRes);

      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.loadAllRelationIds).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalledTimes(4);
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.cache).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });
  });
});
