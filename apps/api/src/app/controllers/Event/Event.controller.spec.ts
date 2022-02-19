import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { DTOGroups, EventDTO } from '@hubbl/shared/models/dto';
import { Event } from '@hubbl/shared/models/entities';

import {
  EventService,
  EventTemplateService,
  GymZoneService,
  OwnerService,
  WorkerService
} from '../../services';
import { DeleteByOwnerWorkerController } from '../Base';
import * as create from '../helpers/create';
import * as update from '../helpers/update';
import {
  EventCreateController,
  EventDeleteController,
  EventUpdateController
} from './Event.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('Event controller', () => {
  const mockEvent = {
    id: 1,
    name: 'Event',
    description: 'Description',
    capacity: 1000,
    covidPassport: true,
    maskRequired: true,
    difficulty: 5,
    startTime: '09:00:00',
    endTime: '10:00:00',
    gym: 1,
    trainer: 1,
    calendar: 1,
    template: 1,
    date: { day: 29, month: 6, year: 2000 }
  };
  const mockDto = {
    ...mockEvent,
    toClass: jest.fn()
  };

  const mockService = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn()
  };
  const fromJsonSpy = jest.spyOn(EventDTO, 'fromJson');

  const mockReq = { body: mockEvent };
  const mockRes = { locals: { token: { id: 1, user: 'owner' } } };

  const logSpy = jest.spyOn(log, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();

    fromJsonSpy.mockResolvedValue(mockDto as any);
  });

  const failSpyAsserts = (
    controller: typeof EventCreateController | typeof EventUpdateController,
    failSpy: any,
    operation: 'create' | 'update'
  ) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      `Controller[${controller.constructor.name}]`,
      `"${operation}" handler`,
      'error-thrown'
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  const servicesAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController
  ) => {
    jest.spyOn(controller, 'fail').mockImplementation();

    controller['service'] = undefined;
    controller['ownerService'] = undefined;
    controller['workerService'] = undefined;

    await controller.execute({} as any, {} as any);

    expect(EventService).toHaveBeenCalledTimes(1);
    expect(EventService).toHaveBeenCalledWith(getRepository);
    expect(OwnerService).toHaveBeenCalledTimes(1);
    expect(OwnerService).toHaveBeenCalledWith(getRepository);
    expect(WorkerService).toHaveBeenCalledTimes(1);
    expect(WorkerService).toHaveBeenCalledWith(getRepository);
  };

  const fromJsonFailAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController
  ) => {
    const fromJsonSpy = jest.spyOn(EventDTO, 'fromJson').mockRejectedValue({});
    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
  };

  const invalidTimesAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController
  ) => {
    const fromJsonSpy = jest.spyOn(EventDTO, 'fromJson').mockResolvedValue({
      startTime: '10:00:00',
      endTime: '09:00:00'
    } as any);
    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(
      mockRes,
      'Start and end time values are not valid'
    );
  };

  const overlappedAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController,
    countTimes = 1
  ) => {
    mockService.getCount.mockResolvedValue(1);

    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockService.getCount).toHaveBeenCalledTimes(countTimes);
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(
      mockRes,
      `[${mockDto.date.year}/${mockDto.date.month}/${mockDto.date.day} ${
        mockDto.startTime
      }-${mockDto.endTime}] overlaps with ${1} events`
    );
  };

  const serviceFailAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController,
    operation: 'create' | 'update',
    countTimes = 1
  ) => {
    mockService.getCount.mockRejectedValue('error-thrown');

    const failSpy = jest.spyOn(controller, 'fail').mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockService.getCount).toHaveBeenCalledTimes(countTimes);
    failSpyAsserts(controller, failSpy, operation);
  };

  describe('EventCreateController', () => {
    const mockTemplate = {
      capacity: 10,
      covidPassport: true,
      maskRequired: true,
      difficulty: 1,
      gym: 2
    };
    const mockCreatedEvent = (template = true): Event => {
      const result = new Event();

      result.name = mockReq.body.name;
      result.description = mockReq.body.description;
      result.capacity = (template ? mockTemplate : mockReq.body).capacity;
      result.covidPassport = (
        template ? mockTemplate : mockReq.body
      ).covidPassport;
      result.maskRequired = (
        template ? mockTemplate : mockReq.body
      ).maskRequired;
      result.difficulty = (template ? mockTemplate : mockReq.body).difficulty;
      result.startTime = mockReq.body.startTime;
      result.endTime = mockReq.body.endTime;
      result.date = mockReq.body.date as any;
      result.trainer = mockReq.body.trainer;
      result.gym = (template ? mockTemplate : mockReq.body).gym;
      result.calendar = mockReq.body.calendar;

      return result;
    };

    const mockTemplateService = { findOne: jest.fn() };
    const mockGymZoneService = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn()
    } as any;

    const cboowSpy = jest.spyOn(create, 'createdByOwnerOrWorker');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      EventCreateController['service'] = mockService as any;
      EventCreateController['templateService'] = mockTemplateService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;
      EventCreateController['gymZoneService'] = mockGymZoneService;
    };

    const createChecks = () => {
      // Gym zone service
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gz'
      });
      expect(mockGymZoneService.select).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.select).toHaveBeenCalledWith('gz.isClassType');
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledWith(
        'gz.calendar = :calendar',
        { calendar: mockDto.calendar }
      );
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveReturned();

      // Event service
      // Two query builders should be created: one to search if the trainer
      // already has an event for the given date and interval, and a second
      // to check if there are any overlapped events
      // Calls checks
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(mockService.where).toHaveBeenCalledTimes(2);
      expect(mockService.andWhere).toHaveBeenCalledTimes(10);
      expect(mockService.getCount).toHaveBeenCalledTimes(2);

      // Common checks
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });
      expect(mockService.where).toHaveBeenCalledWith('e.startTime < :endTime', {
        endTime: mockDto.endTime
      });
      expect(mockService.getCount).toHaveReturnedTimes(2);

      // Trainer already in event checks
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        1,
        'e.endTime > :startTime',
        { startTime: mockDto.startTime }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        2,
        'e.date.year = :year',
        { year: mockDto.date.year }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        3,
        'e.date.month = :month',
        { month: mockDto.date.month }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        4,
        'e.date.day = :day',
        { day: mockDto.date.day }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        5,
        'e.trainer.person.id = :trainer',
        { trainer: mockDto.trainer }
      );

      // Overlapping events query builder checks
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        6,
        'e.endTime > :startTime',
        { startTime: mockDto.startTime }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        7,
        'e.date.year = :year',
        { year: mockDto.date.year }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        8,
        'e.date.month = :month',
        { month: mockDto.date.month }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        9,
        'e.date.day = :day',
        { day: mockDto.date.day }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        10,
        'e.calendar = :calendar',
        { calendar: mockDto.calendar }
      );
      expect(mockService.getCount).toHaveReturned();

      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: mockService,
        ownerService: {},
        workerService: {},
        controller: EventCreateController,
        res: mockRes,
        fromClass: EventDTO.fromClass,
        token: mockRes.locals.token,
        dto: mockDto,
        entityName: 'Event',
        workerCreatePermission: 'createEvents'
      });
    };

    it('should create the services if does not have any', async () => {
      EventCreateController['templateService'] = undefined;
      EventCreateController['gymZoneService'] = undefined;

      await servicesAsserts(EventCreateController);

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(EventTemplateService).toHaveBeenCalledTimes(1);
      expect(EventTemplateService).toHaveBeenCalledWith(getRepository);
    });

    it('should call createByOwnerOrWorker with template data', async () => {
      mockService.getCount.mockResolvedValue(0);
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });
      cboowSpy.mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      // Event service checks
      expect(mockTemplateService.findOne).toHaveBeenCalledTimes(1);
      expect(mockTemplateService.findOne).toHaveBeenCalledWith({
        id: mockReq.body.template,
        options: { loadEagerRelations: false, loadRelationIds: true }
      });

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(
        mockCreatedEvent(),
        DTOGroups.CREATE
      );
    });

    it('should call createByOwnerOrWorker without template data', async () => {
      mockService.getCount.mockResolvedValue(0);
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });
      cboowSpy.mockImplementation();

      setupServices();
      await EventCreateController.execute(
        { body: { ...mockReq.body, template: undefined } } as any,
        mockRes as any
      );

      expect(mockTemplateService.findOne).not.toHaveBeenCalled();

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(
        mockCreatedEvent(false),
        DTOGroups.CREATE
      );

      createChecks();
    });

    it('should send forbidden if template does not exist', async () => {
      mockTemplateService.findOne.mockResolvedValue(undefined);

      const forbiddenSpy = jest
        .spyOn(EventCreateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(mockTemplateService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Event template does not exist.'
      );
    });

    it('should send clientError on fromJson error', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);

      setupServices();
      await fromJsonFailAsserts(EventCreateController);
    });

    it('should send clientError if times are not valid', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });

      setupServices();
      await invalidTimesAsserts(EventCreateController);
    });

    it('should send forbidden if GymZone does not exist', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue(undefined);

      const forbiddenSpy = jest
        .spyOn(EventCreateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      // Gym zone service
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.select).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Gym zone does not exist.'
      );
    });

    it('should send forbidden if GymZone is not of class type', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: false });

      const forbiddenSpy = jest
        .spyOn(EventCreateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      // Gym zone service
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.select).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Cannot create an Event to a non class GymZone.'
      );
    });

    it('should send fail on GymZone service error', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockImplementation(() => {
        throw 'error-thrown';
      });

      const failErrorSpy = jest
        .spyOn(EventCreateController, 'fail')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      // Gym zone service
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);

      expect(failErrorSpy).toHaveBeenCalledTimes(1);
      expect(failErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Internal server error. If the problem persists, contact our team.'
      );
    });

    it('should send forbidden if trainer already has an event', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockService.getCount.mockResolvedValue(1);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });

      const clientErrorSpy = jest
        .spyOn(EventCreateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Trainer has already an event that overlaps with the given date and timestamps.'
      );

      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(5);
    });

    it('should send fail on service error', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });
      mockService.getCount.mockRejectedValue('error-thrown');

      const failSpy = jest
        .spyOn(EventCreateController, 'fail')
        .mockImplementation();

      setupServices();
      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
      failSpyAsserts(EventCreateController, failSpy, 'create');
    });

    it('should send clientError if events overlap', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockService.getCount.mockResolvedValueOnce(0);

      setupServices();
      await overlappedAsserts(EventCreateController, 2);

      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(mockService.where).toHaveBeenCalledTimes(2);
      expect(mockService.andWhere).toHaveBeenCalledTimes(10);
    });

    it('should send fail on service error', async () => {
      mockTemplateService.findOne.mockResolvedValue(mockTemplate);
      mockService.getCount.mockResolvedValueOnce(0);
      mockGymZoneService.getOne.mockResolvedValue({ isClassType: true });

      setupServices();
      await serviceFailAsserts(EventCreateController, 'create', 2);
    });
  });

  describe('EventUpdateController', () => {
    it('should create the services if does not have any', async () => {
      await servicesAsserts(EventUpdateController);
    });

    it('should call updatedByOwnerOrWorker', async () => {
      mockService.getCount.mockResolvedValue(0);

      const uboowSpy = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();

      EventUpdateController['service'] = mockService as any;
      EventUpdateController['ownerService'] = {} as any;
      EventUpdateController['workerService'] = {} as any;

      await EventUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledWith('e.startTime < :endTime', {
        endTime: mockDto.endTime
      });
      expect(mockService.andWhere).toHaveBeenCalledTimes(6);
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        1,
        'e.endTime > :startTime',
        { startTime: mockDto.startTime }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        2,
        'e.date.year = :year',
        { year: mockDto.date.year }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        3,
        'e.date.month = :month',
        { month: mockDto.date.month }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        4,
        'e.date.day = :day',
        { day: mockDto.date.day }
      );
      expect(mockService.andWhere).toHaveBeenNthCalledWith(5, 'e.id != :id', {
        id: mockDto.id
      });
      expect(mockService.andWhere).toHaveBeenNthCalledWith(
        6,
        'e.calendar = :calendar',
        { calendar: mockDto.calendar }
      );
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
      expect(mockService.getCount).toHaveReturned();
      expect(uboowSpy).toHaveBeenCalledTimes(1);
      expect(uboowSpy).toHaveBeenCalledWith({
        service: mockService,
        ownerService: {},
        workerService: {},
        controller: EventUpdateController,
        res: mockRes,
        token: mockRes.locals.token,
        dto: mockDto,
        entityName: 'Event',
        countArgs: { id: mockDto.id },
        workerUpdatePermission: 'updateEvents'
      });
    });

    it('should send clientError on fromJson error', async () => {
      await fromJsonFailAsserts(EventUpdateController);
    });

    it('should send clientError if times are not valid', async () => {
      await invalidTimesAsserts(EventUpdateController);
    });

    it('should send clientError if events overlap', async () => {
      await overlappedAsserts(EventUpdateController);

      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(6);
    });

    it('should send fail on service error', async () => {
      await serviceFailAsserts(EventUpdateController, 'update');
    });
  });

  describe('EventDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(EventDTO, 'fromJson');

      expect(EventDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(EventDeleteController['serviceCtr']).toBe(EventService);
      expect(EventDeleteController['entityName']).toBe('Event');
      expect(EventDeleteController['workerDeletePermission']).toBe(
        'deleteEvents'
      );
    });
  });
});
