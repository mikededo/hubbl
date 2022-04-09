import * as log from 'npmlog';

import { Person } from '@hubbl/shared/models/entities';

import { userAccessToCalendar } from './validations';

jest.mock('../../services');

describe('validations', () => {
  describe('userAccessToCalendar', () => {
    const mockPerson = { id: 3, gym: 1 };

    const mockGymZoneQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      getCount: jest.fn()
    };
    const mockGymZoneService = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockGymZoneQueryBuilder)
    };
    const mockPersonService = { findOne: jest.fn() };

    const mockController = {
      unauthorized: jest.fn(),
      forbidden: jest.fn(),
      fail: jest.fn()
    };

    const logSpy = jest.spyOn(log, 'error').mockImplementation();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const queryBuilderAsserts = () => {
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockGymZoneQueryBuilder.leftJoin).toHaveBeenCalledTimes(3);
      expect(mockGymZoneQueryBuilder.getCount).toHaveBeenCalledTimes(1);
    };

    const failAsserts = (controller: any) => {
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        `Controller [${controller.constructor.name}]`,
        `[Calendar access validation]`,
        'error-thrown'
      );
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {},
        'Internal server error. If the problem persists, contact our team.'
      );
    };

    it('should return the person if it has access to the calendar', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockGymZoneQueryBuilder.getCount.mockResolvedValue(1);

      await userAccessToCalendar({
        controller: mockController as any,
        personService: mockPersonService as any,
        gymZoneService: mockGymZoneService as any,
        res: {} as any,
        personId: mockPerson.id,
        calendarId: 2
      });

      // Check person service is called
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        where: { id: mockPerson.id },
        loadRelationIds: true
      });
      // Check if person can access the calendar
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gz'
      });
      expect(mockGymZoneQueryBuilder.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneQueryBuilder.where).toHaveBeenCalledWith(
        'gz.calendar = :calendarId',
        { calendarId: 2 }
      );
      expect(mockGymZoneQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockGymZoneQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'gym.id = :gymId',
        { gymId: mockPerson.gym }
      );
      expect(mockGymZoneQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'p.id = :personId',
        { personId: mockPerson.id }
      );
      expect(mockGymZoneQueryBuilder.leftJoin).toHaveBeenCalledTimes(3);
      expect(mockGymZoneQueryBuilder.leftJoin).toHaveBeenNthCalledWith(
        1,
        'gz.virtualGym',
        'vg'
      );
      expect(mockGymZoneQueryBuilder.leftJoin).toHaveBeenNthCalledWith(
        2,
        'vg.gym',
        'gym'
      );
      expect(mockGymZoneQueryBuilder.leftJoin).toHaveBeenNthCalledWith(
        3,
        Person,
        'p'
      );
    });

    it('should send unauthorized if person does not exist', async () => {
      mockPersonService.findOne.mockResolvedValue(undefined);

      await userAccessToCalendar({
        controller: mockController as any,
        personService: mockPersonService as any,
        gymZoneService: mockGymZoneService as any,
        res: {} as any,
        personId: mockPerson.id,
        calendarId: 2
      });

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Person does not exist.'
      );
    });

    it('should send on personService error', async () => {
      mockPersonService.findOne.mockRejectedValue('error-thrown');

      await userAccessToCalendar({
        controller: mockController as any,
        personService: mockPersonService as any,
        gymZoneService: mockGymZoneService as any,
        res: {} as any,
        personId: mockPerson.id,
        calendarId: 2
      });

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(mockController);
    });

    it('should send forbidden if user can not access the calendar', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockGymZoneQueryBuilder.getCount.mockResolvedValue(0);

      await userAccessToCalendar({
        controller: mockController as any,
        personService: mockPersonService as any,
        gymZoneService: mockGymZoneService as any,
        res: {} as any,
        personId: mockPerson.id,
        calendarId: 2
      });

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      queryBuilderAsserts();
      expect(mockController.forbidden).toHaveBeenCalledTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledWith(
        {},
        'Client does not have access to the chosen calendar.'
      );
    });

    it('should send fail on queryBuilder error', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockGymZoneQueryBuilder.getCount.mockRejectedValue('error-thrown');

      await userAccessToCalendar({
        controller: mockController as any,
        personService: mockPersonService as any,
        gymZoneService: mockGymZoneService as any,
        res: {} as any,
        personId: mockPerson.id,
        calendarId: 2
      });

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      queryBuilderAsserts();
      failAsserts(mockController);
    });
  });
});
