import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { Event, Person, Trainer } from '@hubbl/shared/models/entities';

import { EventService, GymZoneService, PersonService } from '../../services';
import * as validations from '../helpers/validations';
import { CalendarFetchEventsController } from './Calendar.controller';

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
  event.date = { year: 2022, month: 6, day: 29 } as any;
};

describe('Calendar controller', () => {
  const mockRes = { locals: { token: { id: 1 } } } as any;
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
      query: { by: 'owner', startDate: '2022-06-29' },
      body: {},
      headers: { authorization: 'Any token' }
    } as any;

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      loadAllRelationIds: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const mockEventService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };

    const validationSpy = jest.spyOn(validations, 'userAccessToCalendar');
    const clientErrorSpy = jest
      .spyOn(CalendarFetchEventsController, 'clientError')
      .mockImplementation();

    beforeEach(() => {
      jest.clearAllMocks();
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
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
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
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'e.trainer',
        't'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        't.person',
        'p'
      );
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
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
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.loadRelationCountAndMap).toHaveBeenCalledTimes(1);
      failSpyAsserts(failSpy);
    });
    // queryBuilder error
  });
});
