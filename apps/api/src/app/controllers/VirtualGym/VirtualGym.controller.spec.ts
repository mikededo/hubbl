import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { DTOGroups, VirtualGymDTO } from '@gymman/shared/models/dto';

import {
  OwnerService,
  PersonService,
  VirtualGymService,
  WorkerService
} from '../../services';
import * as create from '../helpers/create';
import * as deleteHelpers from '../helpers/delete';
import * as update from '../helpers/update';
import {
  VirtualGymCreateController,
  VirtualGymDeleteController,
  VirtualGymFetchController,
  VirtualGymUpdateController
} from './VirtualGym.controller';

jest.mock('../../services');

const failSpyAsserts = (failSpy: any) => {
  expect(failSpy).toHaveBeenCalledTimes(1);
  expect(failSpy).toHaveBeenCalledWith(
    {} as any,
    'Internal server error. If the problem persists, contact our team.'
  );
};

describe('VirtualGym Controller', () => {
  const mockPerson = {
    id: 1,
    gym: { id: 1 }
  };
  const mockVirtualGym = {
    id: 1,
    name: 'Test',
    description: '',
    location: 'TestLocation',
    capacity: 1000,
    openTime: '09:00:00',
    closeTime: '21:00:00',
    gym: { id: 1 },
    gymZones: []
  };
  const mockDto = {
    ...mockVirtualGym,
    toClass: jest.fn()
  };
  const mockReq = { body: {}, headers: { authorization: 'Any token' } } as any;

  const mockService = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn()
  };

  const fromClassSpy = jest
    .spyOn(VirtualGymDTO, 'fromClass')
    .mockResolvedValue(mockDto as any);
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

  describe('VirtualGymFetchController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(VirtualGymFetchController, 'fail').mockImplementation();

      VirtualGymFetchController['service'] = undefined;
      VirtualGymFetchController['personService'] = undefined;

      await VirtualGymFetchController.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(VirtualGymService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalled();
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should search for the list of virtual gyms of the auth user gym', async () => {
      mockService.getMany.mockResolvedValue([mockVirtualGym, mockVirtualGym]);
      mockService.findOne.mockResolvedValue(mockPerson);

      VirtualGymFetchController['service'] = mockService as any;
      VirtualGymFetchController['personService'] = mockService as any;

      const okSpy = jest
        .spyOn(VirtualGymFetchController, 'ok')
        .mockReturnValue({} as any);

      await VirtualGymFetchController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'virtualGym'
      });
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledWith('virtualGym.gym = :gym', {
        gym: mockPerson.gym.id
      });
      expect(mockService.getMany).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith({}, [mockDto, mockDto]);
    });

    it('should call fail on person service error', async () => {
      const failSpy = jest
        .spyOn(VirtualGymFetchController, 'fail')
        .mockImplementation();
      mockService.findOne.mockRejectedValue({});

      VirtualGymFetchController['service'] = {} as any;
      VirtualGymFetchController['personService'] = mockService as any;

      await VirtualGymFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call clientError if person does not exist', async () => {
      const clientErrorSpy = jest
        .spyOn(VirtualGymFetchController, 'clientError')
        .mockImplementation();
      mockService.findOne.mockResolvedValue(undefined);

      VirtualGymFetchController['service'] = {} as any;
      VirtualGymFetchController['personService'] = mockService as any;

      await VirtualGymFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        {} as any,
        'Person does not exist'
      );
    });

    it('should call fail on service error', async () => {
      const failSpy = jest
        .spyOn(VirtualGymFetchController, 'fail')
        .mockImplementation();
      mockService.findOne.mockResolvedValue(mockPerson);
      mockService.getMany.mockRejectedValue({});

      VirtualGymFetchController['service'] = mockService as any;
      VirtualGymFetchController['personService'] = mockService as any;

      await VirtualGymFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.getMany).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call fail on service error', async () => {
      const failSpy = jest
        .spyOn(VirtualGymFetchController, 'fail')
        .mockImplementation();
      mockService.findOne.mockResolvedValue(mockPerson);
      mockService.getMany.mockRejectedValue({});

      VirtualGymFetchController['service'] = mockService as any;
      VirtualGymFetchController['personService'] = mockService as any;

      await VirtualGymFetchController.execute(mockReq, {} as any);

      // Ensure token is parsed
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.getMany).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });
  });

  describe('VirtualGymCreateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(VirtualGymCreateController, 'fail').mockImplementation();

      VirtualGymCreateController['service'] = undefined;
      VirtualGymCreateController['ownerService'] = undefined;
      await VirtualGymCreateController.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(VirtualGymService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call createdByOwner', async () => {
      const cboSpy = jest.spyOn(create, 'createdByOwner').mockImplementation();
      const fromJsonSpy = jest
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

      VirtualGymCreateController['service'] = {} as any;
      VirtualGymCreateController['ownerService'] = {} as any;

      await VirtualGymCreateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboSpy).toHaveBeenCalledTimes(1);
      expect(cboSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        controller: VirtualGymCreateController,
        res: {},
        fromClass: VirtualGymDTO.fromClass,
        token: { id: 1 },
        dto: mockDto,
        entityName: 'VirtualGym'
      });
    });

    it('should call clientError on fromJson error', async () => {
      const cboSpy = jest.spyOn(create, 'createdByOwner').mockImplementation();
      const fromJsonSpy = jest
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

      const clientErrorSpy = jest
        .spyOn(VirtualGymCreateController, 'clientError')
        .mockImplementation();

      VirtualGymCreateController['service'] = {} as any;
      VirtualGymCreateController['ownerService'] = {} as any;

      await VirtualGymCreateController.execute(mockReq, {} as any);

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith({}, 'fromJson-error');
    });
  });

  describe('VirtualGymUpdateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(update, 'updatedByOwnerOrWorker').mockImplementation();
      jest.spyOn(VirtualGymDTO, 'fromJson').mockResolvedValue(mockDto as any);

      VirtualGymUpdateController['service'] = undefined;
      VirtualGymUpdateController['ownerService'] = undefined;
      VirtualGymUpdateController['workerService'] = undefined;
      await VirtualGymUpdateController.execute(
        { ...mockReq, query: { by: 'any' } },
        {} as any
      );

      expect(VirtualGymService).toHaveBeenCalled();
      expect(VirtualGymService).toHaveBeenCalledWith(getRepository);
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
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

      VirtualGymUpdateController['service'] = {} as any;
      VirtualGymUpdateController['ownerService'] = {} as any;
      VirtualGymUpdateController['workerService'] = {} as any;

      await VirtualGymUpdateController.execute(
        { ...mockReq, query: { by: 'any' } },
        {} as any
      );

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(uboowSpy).toHaveBeenCalledTimes(1);
      expect(uboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: VirtualGymUpdateController,
        res: {},
        token: { id: 1 },
        dto: mockDto,
        by: 'any',
        entityName: 'VirtualGym',
        updatableBy: '["owner", "worker"]',
        workerUpdatePermission: 'updateVirtualGyms',
        countArgs: { id: mockDto.id }
      });
    });

    it('should call clientError on fromJson error', async () => {
      const uboowSpy = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

      const clientErrorSpy = jest
        .spyOn(VirtualGymUpdateController, 'clientError')
        .mockImplementation();

      VirtualGymUpdateController['service'] = {} as any;
      VirtualGymUpdateController['ownerService'] = {} as any;

      await VirtualGymUpdateController.execute(
        { ...mockReq, query: { by: 'any' } },
        {} as any
      );

      decodeSpyAsserts(jwtSpy);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(uboowSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith({}, 'fromJson-error');
    });
  });

  describe('VirtualGymDeleteController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(VirtualGymDeleteController, 'fail').mockImplementation();

      VirtualGymDeleteController['service'] = undefined;
      VirtualGymDeleteController['ownerService'] = undefined;
      await VirtualGymDeleteController.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(VirtualGymService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call deletedByOwner', async () => {
      const dboSpy = jest
        .spyOn(deleteHelpers, 'deletedByOwner')
        .mockImplementation();
      const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

      VirtualGymDeleteController['service'] = {} as any;
      VirtualGymDeleteController['ownerService'] = {} as any;

      await VirtualGymDeleteController.execute(
        { ...mockReq, params: { id: 1 } },
        {} as any
      );

      decodeSpyAsserts(jwtSpy);
      expect(dboSpy).toHaveBeenCalledTimes(1);
      expect(dboSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        controller: VirtualGymDeleteController,
        res: {},
        token: { id: 1 },
        entityId: 1,
        entityName: 'VirtualGym'
      });
    });
  });
});
