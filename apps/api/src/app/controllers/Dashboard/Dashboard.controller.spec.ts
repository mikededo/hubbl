import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { DashboardDTO } from '@hubbl/shared/models/dto';

import {
  EventService,
  EventTemplateService,
  GymService,
  GymZoneService,
  PersonService,
  TrainerService,
  VirtualGymService
} from '../../services';
import { FetchDashboardController } from './Dashboard.controller';

jest.mock('npmlog');
jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

const getDate = () => {
  const date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
};

describe('DashboardController', () => {
  describe('FetchDashboardController', () => {
    const mockReq = { params: { id: 1 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    // Query builders
    const virtualGymQueryBuilder = {
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const gymZoneQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      loadAllRelationIds: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const trainerQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const todayEventsQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const eventQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const templatesQueryBuilder = {
      limit: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };

    // Services
    const mockPersonService = { findOne: jest.fn() };
    const mockGymService = { findOne: jest.fn() };
    const mockVirtualGymService = {
      createQueryBuilder: jest.fn().mockReturnValue(virtualGymQueryBuilder)
    };
    const mockGymZoneService = {
      createQueryBuilder: jest.fn().mockReturnValue(gymZoneQueryBuilder)
    };
    const mockTrainerService = {
      createQueryBuilder: jest.fn().mockReturnValue(trainerQueryBuilder)
    };
    const mockEventService = {
      createQueryBuilder: jest
        .fn()
        .mockReturnValueOnce(todayEventsQueryBuilder)
        .mockReturnValueOnce(eventQueryBuilder)
    };
    const mockTemplateService = {
      createQueryBuilder: jest.fn().mockReturnValue(templatesQueryBuilder)
    };

    const failSpy = jest.spyOn(FetchDashboardController, 'fail');
    const logSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
      jest.clearAllMocks();

      mockVirtualGymService.createQueryBuilder = jest
        .fn()
        .mockReturnValue(virtualGymQueryBuilder);
      mockGymZoneService.createQueryBuilder = jest
        .fn()
        .mockReturnValue(gymZoneQueryBuilder);
      mockTrainerService.createQueryBuilder = jest
        .fn()
        .mockReturnValue(trainerQueryBuilder);
      mockEventService.createQueryBuilder = jest
        .fn()
        .mockReturnValueOnce(todayEventsQueryBuilder)
        .mockReturnValueOnce(eventQueryBuilder);
      mockTemplateService.createQueryBuilder = jest
        .fn()
        .mockReturnValue(templatesQueryBuilder);

      failSpy.mockImplementation();
    });

    const failAsserts = (res: any) => {
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        `Controller[${FetchDashboardController.constructor.name}]`,
        `"fetch" handler`,
        'error-thrown'
      );
      expect(failSpy).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledWith(
        res,
        'Internal server error. If the error persists, contact our team.'
      );
    };

    const setupServices = () => {
      FetchDashboardController['personService'] = mockPersonService as any;
      FetchDashboardController['gymService'] = mockGymService as any;
      FetchDashboardController['virtualGymService'] =
        mockVirtualGymService as any;
      FetchDashboardController['gymZoneService'] = mockGymZoneService as any;
      FetchDashboardController['eventService'] = mockEventService as any;
      FetchDashboardController['trainerService'] = mockTrainerService as any;
      FetchDashboardController['eventTemplateService'] =
        mockTemplateService as any;
    };

    const successChecks = (res: typeof mockRes | typeof mockClientRes) => {
      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGymService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.id,
        options: { select: ['id'], loadEagerRelations: false }
      });
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: res.locals.token.id,
        options: {
          select: ['id'],
          loadEagerRelations: false,
          where: { gym: mockReq.params.id }
        }
      });
    };

    const virtualGymChecks = () => {
      expect(mockVirtualGymService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockVirtualGymService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'vg'
      });
      expect(virtualGymQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(virtualGymQueryBuilder.where).toHaveBeenCalledWith(
        'vg.gym = :gymId',
        { gymId: mockReq.params.id }
      );
      expect(virtualGymQueryBuilder.limit).toHaveBeenCalledTimes(1);
      expect(virtualGymQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(virtualGymQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(virtualGymQueryBuilder.orderBy).toHaveBeenCalledWith(
        'vg.updated_at',
        'DESC'
      );
      expect(virtualGymQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    };

    const gymZoneChecks = () => {
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gz'
      });
      expect(gymZoneQueryBuilder.leftJoin).toHaveBeenCalledTimes(1);
      expect(gymZoneQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'gz.virtualGym',
        'vg',
        'vg.gym = :gymId',
        { gymId: mockReq.params.id }
      );
      expect(gymZoneQueryBuilder.loadAllRelationIds).toHaveBeenCalledTimes(1);
      expect(gymZoneQueryBuilder.limit).toHaveBeenCalledTimes(1);
      expect(gymZoneQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(gymZoneQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(gymZoneQueryBuilder.orderBy).toHaveBeenCalledWith(
        'gz.updated_at',
        'DESC'
      );
      expect(gymZoneQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    };

    const trainerChecks = () => {
      expect(mockTrainerService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockTrainerService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 't'
      });
      expect(trainerQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(trainerQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        't.person',
        'p'
      );
      expect(trainerQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(trainerQueryBuilder.where).toHaveBeenCalledWith('p.gym = :gymId', {
        gymId: mockReq.params.id
      });
      expect(trainerQueryBuilder.limit).toHaveBeenCalledTimes(1);
      expect(trainerQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(trainerQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(trainerQueryBuilder.orderBy).toHaveBeenCalledWith(
        't.updated_at',
        'DESC'
      );
      expect(trainerQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    };

    const commonEventChecks = (
      queryBuilder: typeof todayEventsQueryBuilder | typeof eventQueryBuilder,
      comparison: '=' | '>='
    ) => {
      const date = getDate();

      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'e.date',
        'd'
      );
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.where).toHaveBeenCalledWith('e.gym = :gymId', {
        gymId: mockReq.params.id
      });
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        `d.year ${comparison} :year`,
        { year: date.year }
      );
      expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        `d.month ${comparison} :month`,
        { month: date.month }
      );
      expect(queryBuilder.andWhere).toHaveBeenNthCalledWith(
        3,
        `d.day ${comparison} :day`,
        {
          day: date.day
        }
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('e.updated_at', 'DESC');
      expect(queryBuilder.getMany).toHaveBeenCalledTimes(1);
    };

    const eventsChecks = (client = false) => {
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'e'
      });

      // Today events
      commonEventChecks(todayEventsQueryBuilder, '=');
      expect(
        todayEventsQueryBuilder.loadRelationCountAndMap
      ).toHaveBeenCalledTimes(1);
      expect(
        todayEventsQueryBuilder.loadRelationCountAndMap
      ).toHaveBeenCalledWith(
        'e.appointmentCount',
        'e.appointments',
        'ea',
        expect.anything()
      );

      // All events
      commonEventChecks(eventQueryBuilder, '>=');
      expect(eventQueryBuilder.limit).toHaveBeenCalledTimes(1);
      expect(eventQueryBuilder.limit).toHaveBeenCalledWith(client ? 15 : 5);
    };

    const templatesChecks = () => {
      expect(mockTemplateService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockTemplateService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'et'
      });
      expect(templatesQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(templatesQueryBuilder.where).toHaveBeenCalledWith(
        'et.gym = :gymId',
        { gymId: mockReq.params.id }
      );
      expect(templatesQueryBuilder.limit).toHaveBeenCalledTimes(1);
      expect(templatesQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(templatesQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
      expect(templatesQueryBuilder.orderBy).toHaveBeenCalledWith(
        'et.updated_at',
        'DESC'
      );
      expect(templatesQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    };

    const setupCallbackChecks = () => {
      todayEventsQueryBuilder.loadRelationCountAndMap
        .mockClear()
        .mockImplementation((paramOne, paramTwo, paramThree, cb) => {
          const mockQb = { where: jest.fn() };

          expect(paramOne).toBeDefined();
          expect(paramTwo).toBeDefined();
          expect(paramThree).toBeDefined();
          expect(cb).toBeDefined();

          // Call the calback
          cb(mockQb);
          // Check qb of the callback
          expect(mockQb.where).toHaveBeenCalledTimes(1);
          expect(mockQb.where).toHaveBeenCalledWith('ea.cancelled = false');

          return todayEventsQueryBuilder;
        });
    };

    it('should create the services if it does not have any', async () => {
      jest.spyOn(FetchDashboardController, 'fail').mockImplementation();

      FetchDashboardController['personService'] = undefined;
      FetchDashboardController['gymService'] = undefined;
      FetchDashboardController['virtualGymService'] = undefined;
      FetchDashboardController['gymZoneService'] = undefined;
      FetchDashboardController['eventService'] = undefined;
      FetchDashboardController['trainerService'] = undefined;
      FetchDashboardController['eventTemplateService'] = undefined;

      await FetchDashboardController.execute({} as any, {} as any);

      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
      expect(GymService).toHaveBeenCalledTimes(1);
      expect(GymService).toHaveBeenCalledWith(getRepository);
      expect(VirtualGymService).toHaveBeenCalledTimes(1);
      expect(VirtualGymService).toHaveBeenCalledWith(getRepository);
      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
      expect(TrainerService).toHaveBeenCalledTimes(1);
      expect(TrainerService).toHaveBeenCalledWith(getRepository);
      expect(EventTemplateService).toHaveBeenCalledTimes(1);
      expect(EventTemplateService).toHaveBeenCalledWith(getRepository);
    });

    it('should fetch all the information for an owner or a worker', async () => {
      // Set up getMany
      mockPersonService.findOne.mockResolvedValue({ id: 1 });
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      virtualGymQueryBuilder.getMany.mockResolvedValue([]);
      gymZoneQueryBuilder.getMany.mockResolvedValue([]);
      trainerQueryBuilder.getMany.mockResolvedValue([]);
      todayEventsQueryBuilder.getMany.mockResolvedValue([]);
      eventQueryBuilder.getMany.mockResolvedValue([]);
      templatesQueryBuilder.getMany.mockResolvedValue([]);

      // Check query builder of todayEventQueryBuilder
      setupCallbackChecks();

      const fromClassSpy = jest
        .spyOn(DashboardDTO, 'fromClass')
        .mockReturnValue({} as any);
      const okSpy = jest
        .spyOn(FetchDashboardController, 'ok')
        .mockImplementation();

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      // Common checks
      successChecks(mockRes);

      // Query builders checks
      virtualGymChecks();
      gymZoneChecks();
      trainerChecks();
      eventsChecks();
      templatesChecks();

      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith({
        virtualGyms: [],
        gymZones: [],
        todayEvents: [],
        events: [],
        trainers: [],
        templates: []
      });
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, {});
    });

    it('should fetch all the information for a client', async () => {
      // Set up getMany
      mockPersonService.findOne.mockResolvedValue({ id: 1 });
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      virtualGymQueryBuilder.getMany.mockResolvedValue([]);
      gymZoneQueryBuilder.getMany.mockResolvedValue([]);
      todayEventsQueryBuilder.getMany.mockResolvedValue([]);
      eventQueryBuilder.getMany.mockResolvedValue([]);

      // Check query builder of todayEventQueryBuilder
      setupCallbackChecks();

      const fromClassSpy = jest
        .spyOn(DashboardDTO, 'fromClass')
        .mockReturnValue({} as any);
      const okSpy = jest
        .spyOn(FetchDashboardController, 'ok')
        .mockImplementation();

      setupServices();
      await FetchDashboardController.execute(
        mockReq as any,
        mockClientRes as any
      );

      // Common checks
      successChecks(mockClientRes);

      // Query builders checks
      virtualGymChecks();
      gymZoneChecks();
      eventsChecks(true);

      // Client specific
      expect(mockTrainerService.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockTemplateService.createQueryBuilder).not.toHaveBeenCalled();

      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith({
        virtualGyms: [],
        gymZones: [],
        todayEvents: [],
        events: [],
        trainers: undefined,
        templates: undefined
      });
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockClientRes, {});
    });

    it('should send clientError if no given gym id', async () => {
      const clientErrorSpy = jest
        .spyOn(FetchDashboardController, 'clientError')
        .mockImplementation();

      setupServices();
      await FetchDashboardController.execute(
        { params: {} } as any,
        mockRes as any
      );

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, 'No gym id given.');
    });

    it('should send forbidden if gym does not exist', async () => {
      const forbiddenSpy = jest
        .spyOn(FetchDashboardController, 'forbidden')
        .mockImplementation();
      mockGymService.findOne.mockResolvedValue(undefined);

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(mockRes, 'Gym does not exist.');
    });

    it('should send fail on gymService error', async () => {
      mockGymService.findOne.mockRejectedValue('error-thrown');

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(mockRes);
    });

    it('should send unauthorized if user does not have access to the gym', async () => {
      const unauthorizedSpy = jest
        .spyOn(FetchDashboardController, 'unauthorized')
        .mockImplementation();
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      mockPersonService.findOne.mockResolvedValue(undefined);

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledWith(
        mockRes,
        'User does not have access to the given gym.'
      );
    });

    it('should send fail on personService error', async () => {
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      mockPersonService.findOne.mockRejectedValue('error-thrown');

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(mockRes);
    });

    it('should send fail on any other service error as owner or worker', async () => {
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      mockPersonService.findOne.mockResolvedValue({ id: 1 });
      virtualGymQueryBuilder.getMany.mockRejectedValue('error-thrown');

      setupServices();
      await FetchDashboardController.execute(mockReq as any, mockRes as any);

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockVirtualGymService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(mockTrainerService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockTemplateService.createQueryBuilder).toHaveBeenCalledTimes(1);
      failAsserts(mockRes);
    });

    it('should send fail on any other service error as client', async () => {
      mockGymService.findOne.mockResolvedValue({ id: 1 });
      mockPersonService.findOne.mockResolvedValue({ id: 1 });
      virtualGymQueryBuilder.getMany.mockRejectedValue('error-thrown');

      setupServices();
      await FetchDashboardController.execute(
        mockReq as any,
        mockClientRes as any
      );

      expect(mockGymService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockVirtualGymService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockEventService.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(mockTrainerService.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockTemplateService.createQueryBuilder).not.toHaveBeenCalled();
      failAsserts(mockClientRes);
    });
  });
});
