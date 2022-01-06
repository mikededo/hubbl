import { DTOGroups, EventDTO } from '@hubbl/shared/models/dto';
import { getRepository } from 'typeorm';
import { EventService, OwnerService, WorkerService } from '../../services';
import { EventCreateController } from './Event.controller';
import * as create from '../helpers/create';

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

  describe('EventCreateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(EventCreateController, 'fail').mockImplementation();

      EventCreateController['service'] = undefined;
      EventCreateController['ownerService'] = undefined;
      EventCreateController['workerService'] = undefined;

      await EventCreateController.execute({} as any, {} as any);

      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
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
      expect(mockService.andWhere).toHaveBeenCalledTimes(4);
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
      const fromJsonSpy = jest
        .spyOn(EventDTO, 'fromJson')
        .mockRejectedValue({});
      const clientErrorSpy = jest
        .spyOn(EventCreateController, 'clientError')
        .mockImplementation();

      EventCreateController['service'] = mockService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;

      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
    });

    it('should send clientError if times are not valid', async () => {
      const fromJsonSpy = jest.spyOn(EventDTO, 'fromJson').mockResolvedValue({
        startTime: '10:00:00',
        endTime: '09:00:00'
      } as any);
      const clientErrorSpy = jest
        .spyOn(EventCreateController, 'clientError')
        .mockImplementation();

      EventCreateController['service'] = mockService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;

      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Start and end time values are not valid'
      );
    });

    it('should send clientError if events overlap', async () => {
      mockService.getCount.mockResolvedValue(1);

      const fromJsonSpy = jest
        .spyOn(EventDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const clientErrorSpy = jest
        .spyOn(EventCreateController, 'clientError')
        .mockImplementation();

      EventCreateController['service'] = mockService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;

      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(4);
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        `[${mockDto.date.year}/${mockDto.date.month}/${mockDto.date.day} ${
          mockDto.startTime
        }-${mockDto.endTime}] overlaps with ${1} events`
      );
    });

    it('should send fail on service error', async () => {
      mockService.getCount.mockRejectedValue({});

      const fromJsonSpy = jest
        .spyOn(EventDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const failErrorSpy = jest
        .spyOn(EventCreateController, 'fail')
        .mockImplementation();

      EventCreateController['service'] = mockService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;

      await EventCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.andWhere).toHaveBeenCalledTimes(4);
      expect(mockService.getCount).toHaveBeenCalledTimes(1);
      expect(failErrorSpy).toHaveBeenCalledTimes(1);
      expect(failErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Internal server error. If the problem persists, contact our team.'
      );
    });
  });
});
