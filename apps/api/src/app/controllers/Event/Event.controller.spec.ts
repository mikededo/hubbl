import { getRepository } from 'typeorm';

import { DTOGroups, EventDTO } from '@hubbl/shared/models/dto';

import { EventService, OwnerService, WorkerService } from '../../services';
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
    startTime: '09:00:00',
    endTime: '10:00:00',
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
  const mockReq = { query: { by: 'owner' }, body: {} };
  const mockRes = { locals: { token: { id: 1 } } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    controller: typeof EventCreateController | typeof EventUpdateController
  ) => {
    mockService.getCount.mockResolvedValue(1);

    const fromJsonSpy = jest
      .spyOn(EventDTO, 'fromJson')
      .mockResolvedValue(mockDto as any);
    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockService.getCount).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(
      mockRes,
      `[${mockDto.date.year}/${mockDto.date.month}/${mockDto.date.day} ${
        mockDto.startTime
      }-${mockDto.endTime}] overlaps with ${1} events`
    );
  };

  const serviceFailAsserts = async (
    controller: typeof EventCreateController | typeof EventUpdateController
  ) => {
    mockService.getCount.mockRejectedValue({});

    const fromJsonSpy = jest
      .spyOn(EventDTO, 'fromJson')
      .mockResolvedValue(mockDto as any);
    const failErrorSpy = jest.spyOn(controller, 'fail').mockImplementation();

    controller['service'] = mockService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq as any, mockRes as any);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockService.getCount).toHaveBeenCalledTimes(1);
    expect(failErrorSpy).toHaveBeenCalledTimes(1);
    expect(failErrorSpy).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  describe('EventCreateController', () => {
    it('should create the services if does not have any', async () => {
      servicesAsserts(EventCreateController);
    });

    it('should call createByOwnerOrWorker', async () => {
      mockService.getCount.mockResolvedValue(0);

      const fromJsonSpy = jest
        .spyOn(EventDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();

      EventCreateController['service'] = mockService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;

      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.CREATE);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledWith('e.startTime < :endTime', {
        endTime: mockDto.endTime
      });
      expect(mockService.andWhere).toHaveBeenCalledTimes(5);
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
        'e.calendar = :calendar',
        { calendar: mockDto.calendar }
      );
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
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
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'Event',
        workerCreatePermission: 'createEvents'
      });
    });

    it('should send clientError on fromJson error', async () => {
      fromJsonFailAsserts(EventCreateController);
    });

    it('should send clientError if times are not valid', async () => {
      invalidTimesAsserts(EventCreateController);
    });

    it('should send clientError if events overlap', async () => {
      await overlappedAsserts(EventCreateController);

      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(5);
    });

    it('should send fail on service error', async () => {
      serviceFailAsserts(EventCreateController);
    });
  });

  describe('EventUpdateController', () => {
    it('should create the services if does not have any', async () => {
      servicesAsserts(EventUpdateController);
    });

    it('should call updatedByOwnerOrWorker', async () => {
      mockService.getCount.mockResolvedValue(0);

      const fromJsonSpy = jest
        .spyOn(EventDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const uboowSpy = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();

      EventUpdateController['service'] = mockService as any;
      EventUpdateController['ownerService'] = {} as any;
      EventUpdateController['workerService'] = {} as any;

      await EventUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.CREATE);
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
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'Event',
        updatableBy: '["owner", "worker"]',
        countArgs: { id: mockDto.id },
        workerUpdatePermission: 'updateEvents'
      });
    });

    it('should send clientError on fromJson error', async () => {
      fromJsonFailAsserts(EventUpdateController);
    });

    it('should send clientError if times are not valid', async () => {
      invalidTimesAsserts(EventUpdateController);
    });

    it('should send clientError if events overlap', async () => {
      await overlappedAsserts(EventUpdateController);

      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(6);
    });

    it('should send fail on service error', async () => {
      serviceFailAsserts(EventUpdateController);
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
