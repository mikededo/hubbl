import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, GymZoneDTO } from '@gymman/shared/models/dto';

import { GymZoneService, OwnerService, WorkerService } from '../../services';
import * as create from '../helpers/create';
import * as update from '../helpers/update';
import {
  GymZoneCreateController,
  GymZoneUpdateController
} from './GymZone.controller';

jest.mock('../../services');

describe('GymZone controller', () => {
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
    query: { by: 'owner' },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const decodeSpyAsserts = (jwtSpy: any) => {
    expect(jwtSpy).toHaveBeenCalledTimes(1);
    expect(jwtSpy).toHaveBeenCalledWith(
      mockReq.headers.authorization.split(' ')[1]
    );
  };

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
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

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
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

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
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

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
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

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
});
