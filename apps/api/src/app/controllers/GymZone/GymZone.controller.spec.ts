import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, GymZoneDTO } from '@hubbl/shared/models/dto';

import {
  GymZoneService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../services';
import * as create from '../helpers/create';
import * as deleteHelpers from '../helpers/delete';
import * as update from '../helpers/update';
import {
  GymZoneCreateController,
  GymZoneDeleteController,
  GymZoneFetchController,
  GymZoneUpdateController
} from './GymZone.controller';

jest.mock('../../services');

const failSpyAsserts = (failSpy: any) => {
  expect(failSpy).toHaveBeenCalledTimes(1);
  expect(failSpy).toHaveBeenCalledWith(
    {} as any,
    'Internal server error. If the problem persists, contact our team.'
  );
};

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
    params: { id: 1, vgId: 1 },
    query: { by: 'owner' },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const decodeSpyAsserts = (jwtSpy: any) => {
    expect(jwtSpy).toHaveBeenCalledTimes(1);
    expect(jwtSpy).toHaveBeenCalledWith(
      mockReq.headers.authorization.split(' ')[1]
    );
  };

  describe('GymZoneFetchController', () => {
    const mockGymZoneService = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({})
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

    it('should fetch the gym zone', async () => {
      const fromClassSpy = jest
        .spyOn(GymZoneDTO, 'fromClass')
        .mockResolvedValue(mockDto as any);
      const okSpy = jest
        .spyOn(GymZoneFetchController, 'ok')
        .mockImplementation();
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith(1);
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
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledWith(
        'gymZone.id = :gymZoneId',
        { gymZoneId: mockReq.params.id }
      );
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveReturned();
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith({});
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith({}, mockDto);
    });

    it('should call fail on person service error', async () => {
      const failSpy = jest
        .spyOn(GymZoneFetchController, 'fail')
        .mockImplementation();
      mockPersonService.findOne.mockRejectedValue({});

      GymZoneFetchController['service'] = {} as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
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

      await GymZoneFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        {} as any,
        'Person does not exist'
      );
    });

    it('should call fail on service error', async () => {
      const failSpy = jest
        .spyOn(GymZoneFetchController, 'fail')
        .mockImplementation();
      mockGymZoneService.getOne.mockRejectedValue({});
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.leftJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call fail on fromClass error', async () => {
      const failSpy = jest
        .spyOn(GymZoneFetchController, 'fail')
        .mockImplementation();
      const fromClassSpy = jest
        .spyOn(GymZoneDTO, 'fromClass')
        .mockRejectedValue({});
      mockGymZoneService.getOne.mockResolvedValue(mockGymZone);
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      GymZoneFetchController['service'] = mockGymZoneService as any;
      GymZoneFetchController['personService'] = mockPersonService as any;

      await GymZoneFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockGymZoneService.leftJoin).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.where).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.getOne).toHaveBeenCalledTimes(1);
      // Ensure fromClass is called
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith(mockGymZone);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });
  });

  describe('GymZoneCreateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(GymZoneCreateController, 'fail').mockImplementation();

      GymZoneCreateController['service'] = undefined;
      GymZoneCreateController['ownerService'] = undefined;
      GymZoneCreateController['workerService'] = undefined;
      await GymZoneCreateController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalled();
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalled();
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call createdByOwnerOrWorker', async () => {
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(GymZoneDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);

      GymZoneCreateController['service'] = {} as any;
      GymZoneCreateController['ownerService'] = {} as any;
      GymZoneCreateController['workerService'] = {} as any;

      await GymZoneCreateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: GymZoneCreateController,
        res: {},
        fromClass: GymZoneDTO.fromClass,
        token: { id: 1 },
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'GymZone',
        workerCreatePermission: 'createGymZones'
      });
    });

    it('should call clientError on fromJson error', async () => {
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(GymZoneDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');

      const clientErrorSpy = jest
        .spyOn(GymZoneCreateController, 'clientError')
        .mockImplementation();

      GymZoneCreateController['service'] = {} as any;
      GymZoneCreateController['ownerService'] = {} as any;
      GymZoneCreateController['workerService'] = {} as any;

      await GymZoneCreateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboowSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith({}, 'fromJson-error');
    });
  });

  describe('GymZoneUpdateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(GymZoneUpdateController, 'fail').mockImplementation();

      GymZoneUpdateController['service'] = undefined;
      GymZoneUpdateController['ownerService'] = undefined;
      GymZoneUpdateController['workerService'] = undefined;
      await GymZoneUpdateController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalled();
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalled();
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call updatedByOwnerOrWorker', async () => {
      const uboowSpy = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(GymZoneDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);

      GymZoneUpdateController['service'] = {} as any;
      GymZoneUpdateController['ownerService'] = {} as any;
      GymZoneUpdateController['workerService'] = {} as any;

      await GymZoneUpdateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(uboowSpy).toHaveBeenCalledTimes(1);
      expect(uboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: GymZoneUpdateController,
        res: {},
        token: { id: 1 },
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'GymZone',
        updatableBy: '["owner", "worker"]',
        countArgs: { id: 1 },
        workerUpdatePermission: 'updateGymZones'
      });
    });

    it('should call clientError on fromJson error', async () => {
      const uboowSpy = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(GymZoneDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');

      const clientErrorSpy = jest
        .spyOn(GymZoneUpdateController, 'clientError')
        .mockImplementation();

      GymZoneUpdateController['service'] = {} as any;
      GymZoneUpdateController['ownerService'] = {} as any;
      GymZoneUpdateController['workerService'] = {} as any;

      await GymZoneUpdateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(uboowSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith({}, 'fromJson-error');
    });
  });

  describe('GymZoneDeleteController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(GymZoneDeleteController, 'fail').mockImplementation();

      GymZoneDeleteController['service'] = undefined;
      GymZoneDeleteController['ownerService'] = undefined;
      GymZoneDeleteController['workerService'] = undefined;
      await GymZoneDeleteController.execute({} as any, {} as any);

      expect(GymZoneService).toHaveBeenCalled();
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalled();
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call deletedByOwnerOrWorker', async () => {
      const dboowSpy = jest
        .spyOn(deleteHelpers, 'deletedByOwnerOrWorker')
        .mockImplementation();

      GymZoneDeleteController['service'] = {} as any;
      GymZoneDeleteController['ownerService'] = {} as any;
      GymZoneDeleteController['workerService'] = {} as any;

      await GymZoneDeleteController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(dboowSpy).toHaveBeenCalledTimes(1);
      expect(dboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: GymZoneDeleteController,
        res: {},
        token: { id: 1 },
        by: mockReq.query.by,
        entityId: mockReq.params.id,
        entityName: 'GymZone',
        countArgs: { id: 1 },
        workerDeletePermission: 'deleteGymZones'
      });
    });
  });
});
