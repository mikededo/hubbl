import * as log from 'npmlog';

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
  GymZoneFetchSingleController,
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
    params: { vgId: 1, id: 2 },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  const logSpy = jest.spyOn(log, 'error').mockImplementation();
  const mockRes = { locals: { token: { id: 1 } } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const personServiceFail = async (
    controller:
      | typeof GymZoneFetchController
      | typeof GymZoneFetchSingleController,
    personService: any
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockImplementation();
    personService.findOneBy.mockRejectedValue({});

    controller['service'] = {} as any;
    controller['personService'] = personService as any;

    await controller.execute(mockReq, mockRes);

    expect(personService.findOneBy).toHaveBeenCalledTimes(1);
    // Ensure fail is called
    failSpyAsserts(failSpy);
  };

  const nonExistingPersonError = async (
    controller:
      | typeof GymZoneFetchController
      | typeof GymZoneFetchSingleController,
    personService: any
  ) => {
    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();
    personService.findOneBy.mockResolvedValue(undefined);

    controller['service'] = {} as any;
    controller['personService'] = personService as any;

    await controller.execute(mockReq, mockRes);

    expect(personService.findOneBy).toHaveBeenCalledTimes(1);
    // Ensure fail is called
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(
      mockRes,
      'Person does not exist'
    );
  };

  const gymZoneServiceError = async (
    controller:
      | typeof GymZoneFetchController
      | typeof GymZoneFetchSingleController,
    gymZoneService: any,
    personService: any
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockImplementation();
    gymZoneService.getMany?.mockRejectedValue({});
    gymZoneService.getOne?.mockRejectedValue({});
    personService.findOneBy.mockResolvedValue(mockPerson);

    controller['service'] = gymZoneService as any;
    controller['personService'] = personService as any;

    await controller.execute(mockReq, mockRes);

    expect(personService.findOneBy).toHaveBeenCalledTimes(1);
    // Ensure fail is called
    failSpyAsserts(failSpy);
  };

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
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockImplementation()
    };
    const mockPersonService = {
      findOneBy: jest.fn()
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
      expect(PersonService).toHaveBeenCalledTimes(1);
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
      mockPersonService.findOneBy.mockResolvedValue(mockPerson);
      mockGymZoneService.getMany.mockResolvedValue(resultList);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOneBy).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gymZone'
      });
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'gymZone.calendar',
        'calendar'
      );
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        'gymZone.virtualGym',
        'virtualGym',
        'virtualGym.id = :vgId',
        { vgId: mockReq.params.vgId }
      );
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledWith(
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
      await personServiceFail(GymZoneFetchController, mockPersonService);
    });

    it('should call clientError if person does not exist', async () => {
      await nonExistingPersonError(GymZoneFetchController, mockPersonService);
    });

    it('should call fail on service error', async () => {
      await gymZoneServiceError(
        GymZoneFetchController,
        mockGymZoneService,
        mockPersonService
      );

      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GymZoneFetchSingleController', () => {
    const mockGymZoneService = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockImplementation()
    };
    const mockPersonService = {
      findOneBy: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the services if does not have any', async () => {
      jest.spyOn(GymZoneFetchSingleController, 'fail').mockImplementation();

      GymZoneFetchSingleController['service'] = undefined;
      GymZoneFetchSingleController['personService'] = undefined;
      await GymZoneFetchSingleController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledTimes(1);
    });

    it('should fetch a the gym zone', async () => {
      const fromClassSpy = jest
        .spyOn(GymZoneDTO, 'fromClass')
        .mockReturnValue(mockDto as any);
      const okSpy = jest
        .spyOn(GymZoneFetchSingleController, 'ok')
        .mockImplementation();
      mockPersonService.findOneBy.mockResolvedValue(mockPerson);
      mockGymZoneService.getOne.mockResolvedValue(mockGymZone);

      GymZoneFetchSingleController['service'] = mockGymZoneService as any;
      GymZoneFetchSingleController['personService'] = mockPersonService as any;

      await GymZoneFetchSingleController.execute(mockReq, mockRes);

      expect(mockPersonService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOneBy).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'gymZone'
      });
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'gymZone.calendar',
        'calendar'
      );
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        'gymZone.virtualGym',
        'virtualGym',
        'virtualGym.id = :vgId',
        { vgId: mockReq.params.vgId }
      );
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledWith(
        'virtualGym.gym',
        'gym',
        'gym.id = :gId',
        { gId: mockPerson.gym.id }
      );
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledWith(
        'gymZone.id = :gzId',
        { gzId: mockReq.params.id }
      );
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveReturned();
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith(mockGymZone);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, mockDto);
    });

    it('should call fail on person service error', async () => {
      await personServiceFail(GymZoneFetchSingleController, mockPersonService);
    });

    it('should call clientError if person does not exist', async () => {
      await nonExistingPersonError(
        GymZoneFetchSingleController,
        mockPersonService
      );
    });

    it('should call fail on service error', async () => {
      await gymZoneServiceError(
        GymZoneFetchSingleController,
        mockGymZoneService,
        mockPersonService
      );

      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.innerJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.innerJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
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
