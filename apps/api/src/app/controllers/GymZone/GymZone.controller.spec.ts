import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { GymZoneDTO } from '@hubbl/shared/models/dto';

import { GymZoneService, PersonService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import {
  GymZoneCreateController,
  GymZoneDeleteController,
  GymZoneFetchController,
  GymZoneUpdateController
} from './GymZone.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('GymZone controller', () => {
  const mockPerson = {
    id: 1,
    gym: { id: 1 }
  };
  const mockGymZone = {
    id: 1,
    name: 'Test',
    description: '',
    isClassType: true,
    capacity: 1000,
    maskRequired: true,
    covidPassport: true,
    openTime: '09:00:00',
    closeTime: '21:00:00',
    timeIntervals: [],
    virtualGym: 1
  };
  const mockDto = {
    ...mockGymZone,
    toClass: jest.fn()
  };
  const mockReq = {
    params: { vgId: 1 },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  const logSpy = jest.spyOn(log, 'error').mockImplementation();
  const mockRes = { locals: { token: { id: 1 } } } as any;

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

  describe('GymZoneFetchController', () => {
    const mockGymZoneService = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockImplementation()
    };
    const mockPersonService = {
      findOne: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the services if does not have any', async () => {
      jest.spyOn(GymZoneFetchController, 'fail').mockImplementation();

      GymZoneFetchController['service'] = undefined;
      GymZoneFetchController['personService'] = undefined;
      await GymZoneFetchController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should fetch the gym zones', async () => {
      const resultList = {
        map: jest.fn().mockImplementation((callback: any) => {
          expect(callback).toBeDefined();

          return [mockGymZone, mockGymZone].map(callback);
        })
      };

      const fromClassSpy = jest
        .spyOn(GymZoneDTO, 'fromClass')
        .mockReturnValue(mockDto as any);
      const okSpy = jest
        .spyOn(GymZoneFetchController, 'ok')
        .mockImplementation();
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockGymZoneService.getMany.mockResolvedValue(resultList);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gymZone'
      });
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'gymZone.calendar',
        'calendar'
      );
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        'gymZone.virtualGym',
        'virtualGym',
        'virtualGym.id = :id',
        { id: mockReq.params.vgId }
      );
      expect(mockGymZoneService.leftJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.leftJoin).toHaveBeenCalledWith(
        'virtualGym.gym',
        'gym',
        'gym.id = :id',
        { id: mockPerson.gym.id }
      );
      expect(mockGymZoneService.getMany).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getMany).toHaveReturned();
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(fromClassSpy).toHaveBeenCalledWith(
        mockGymZone,
        expect.anything(),
        expect.anything()
      );
      // expect(result.length).toBe(2);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, [mockDto, mockDto]);
    });

    it('should call fail on person service error', async () => {
      const failSpy = jest
        .spyOn(GymZoneFetchController, 'fail')
        .mockImplementation();
      mockPersonService.findOne.mockRejectedValue({});

      GymZoneFetchController['service'] = {} as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call clientError if person does not exist', async () => {
      const clientErrorSpy = jest
        .spyOn(GymZoneFetchController, 'clientError')
        .mockImplementation();
      mockPersonService.findOne.mockResolvedValue(undefined);

      GymZoneFetchController['service'] = {} as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist'
      );
    });

    it('should call fail on service error', async () => {
      const failSpy = jest
        .spyOn(GymZoneFetchController, 'fail')
        .mockImplementation();
      mockGymZoneService.getMany.mockRejectedValue({});
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.leftJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getMany).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });
  });

  describe('GymZoneCreateController', () => {
    it('should create an CreateByOwnerWorkerController', () => {
      jest.spyOn(GymZoneDTO, 'fromJson');

      expect(GymZoneCreateController).toBeInstanceOf(
        CreateByOwnerWorkerController
      );
      expect(GymZoneCreateController['serviceCtr']).toBe(GymZoneService);
      expect(GymZoneCreateController['fromJson']).toBe(GymZoneDTO.fromJson);
      expect(GymZoneCreateController['fromClass']).toBe(GymZoneDTO.fromClass);
      expect(GymZoneCreateController['entityName']).toBe('GymZone');
      expect(GymZoneCreateController['workerCreatePermission']).toBe(
        'createGymZones'
      );
    });
  });

  describe('GymZoneUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(GymZoneDTO, 'fromJson');

      expect(GymZoneUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(GymZoneUpdateController['serviceCtr']).toBe(GymZoneService);
      expect(GymZoneUpdateController['fromJson']).toBe(GymZoneDTO.fromJson);
      expect(GymZoneUpdateController['entityName']).toBe('GymZone');
      expect(GymZoneUpdateController['workerUpdatePermission']).toBe(
        'updateGymZones'
      );
    });
  });

  describe('GymZoneDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(GymZoneDTO, 'fromJson');

      expect(GymZoneDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(GymZoneDeleteController['serviceCtr']).toBe(GymZoneService);
      expect(GymZoneDeleteController['entityName']).toBe('GymZone');
      expect(GymZoneDeleteController['workerDeletePermission']).toBe(
        'deleteGymZones'
      );
    });
  });
});
