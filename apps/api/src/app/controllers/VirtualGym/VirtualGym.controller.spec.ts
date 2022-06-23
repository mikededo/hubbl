import * as log from 'npmlog';

import { DTOGroups, VirtualGymDTO } from '@hubbl/shared/models/dto';

import { OwnerService, PersonService, VirtualGymService } from '../../services';
import { UpdateByOwnerWorkerController } from '../Base';
import * as create from '../helpers/create';
import * as deleteHelpers from '../helpers/delete';
import {
  VirtualGymCreateController,
  VirtualGymDeleteController,
  VirtualGymFetchController,
  VirtualGymFetchSingleController,
  VirtualGymUpdateController
} from './VirtualGym.controller';

jest.mock('@hubbl/shared/models/dto');
jest.mock('../../services');

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
  const mockReq = {
    body: {},
    headers: { authorization: 'Any token' },
    query: { level: 1 },
    params: { id: 1 }
  } as any;
  const mockRes = { locals: { token: { id: 1, user: 'owner' } } } as any;

  const mockService = {
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    innerJoinAndMapMany: jest.fn().mockReturnThis(),
    innerJoinAndMapOne: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn()
  };

  const fromClassSpy = jest
    .spyOn(VirtualGymDTO, 'fromClass')
    .mockReturnValue(mockDto as any);
  const logSpy = jest.spyOn(log, 'error').mockImplementation();

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

  describe('fetch', () => {
    type Controller =
      | typeof VirtualGymFetchController
      | typeof VirtualGymFetchSingleController;

    const checkServices = async (controller: Controller) => {
      jest.spyOn(controller, 'fail').mockImplementation();

      controller['service'] = undefined;
      controller['personService'] = undefined;

      await controller.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(PersonService).toHaveBeenCalled();
    };

    const onPersonServiceError = async (controller: Controller) => {
      const failSpy = jest.spyOn(controller, 'fail').mockImplementation();
      mockService.findOneBy.mockRejectedValue({});

      controller['service'] = {} as any;
      controller['personService'] = mockService as any;

      await controller.execute(mockReq, mockRes);

      expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    };

    const onClientErrorFail = async (controller: Controller) => {
      const clientErrorSpy = jest
        .spyOn(controller, 'clientError')
        .mockImplementation();
      mockService.findOneBy.mockResolvedValue(undefined);

      controller['service'] = {} as any;
      controller['personService'] = mockService as any;

      await controller.execute(mockReq, mockRes);

      expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist'
      );
    };

    const onServiceFail = async (
      controller: Controller,
      get: 'getMany' | 'getOne'
    ) => {
      const failSpy = jest.spyOn(controller, 'fail').mockImplementation();
      mockService.findOneBy.mockResolvedValue(mockPerson);
      mockService[get].mockRejectedValue({});

      controller['service'] = mockService as any;
      controller['personService'] = mockService as any;

      await controller.execute(mockReq, mockRes);

      expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService[get]).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    };

    describe('VirtualGymFetchController', () => {
      it('should create the services if does not have any', async () => {
        await checkServices(VirtualGymFetchController);
      });

      it('should search for the list of virtual gyms of the auth user gym', async () => {
        mockService.getMany.mockResolvedValue([mockVirtualGym, mockVirtualGym]);
        mockService.findOneBy.mockResolvedValue(mockPerson);

        VirtualGymFetchController['service'] = mockService as any;
        VirtualGymFetchController['personService'] = mockService as any;

        const okSpy = jest
          .spyOn(VirtualGymFetchController, 'ok')
          .mockReturnValue({} as any);

        await VirtualGymFetchController.execute(mockReq, mockRes);

        expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
        expect(mockService.findOneBy).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
          alias: 'virtualGym'
        });
        expect(mockService.innerJoinAndMapMany).toHaveBeenCalledTimes(1);
        expect(mockService.innerJoinAndMapMany).toHaveBeenCalledWith(
          'virtualGym.gymZones',
          'virtualGym.gymZones',
          'gz'
        );
        expect(mockService.where).toHaveBeenCalledTimes(1);
        expect(mockService.where).toHaveBeenCalledWith(
          'virtualGym.gym = :gym',
          { gym: mockPerson.gym.id }
        );
        expect(mockService.getMany).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(2);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes, [mockDto, mockDto]);
      });

      it('should not join the gyms if level is 0', async () => {
        mockService.getMany.mockResolvedValue([mockVirtualGym, mockVirtualGym]);
        mockService.findOneBy.mockResolvedValue(mockPerson);

        VirtualGymFetchController['service'] = mockService as any;
        VirtualGymFetchController['personService'] = mockService as any;

        const okSpy = jest
          .spyOn(VirtualGymFetchController, 'ok')
          .mockReturnValue({} as any);

        await VirtualGymFetchController.execute(
          {
            ...mockReq,
            query: { level: 0 }
          },
          mockRes
        );

        expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
        expect(mockService.findOneBy).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
          alias: 'virtualGym'
        });
        expect(mockService.innerJoinAndMapMany).not.toHaveBeenCalled();
        expect(mockService.where).not.toHaveBeenCalled();
        expect(mockService.getMany).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(2);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes, [mockDto, mockDto]);
      });

      it('should call fail on person service error', async () => {
        await onPersonServiceError(VirtualGymFetchController);
      });

      it('should call clientError if person does not exist', async () => {
        await onClientErrorFail(VirtualGymFetchController);
      });

      it('should call fail on service error', async () => {
        await onServiceFail(VirtualGymFetchController, 'getMany');
      });
    });

    describe('VirtualGymFetchSingleController', () => {
      it('should create the services if does not have any', async () => {
        await checkServices(VirtualGymFetchSingleController);
      });

      it('should search for a virtual gym of the auth user gym', async () => {
        mockService.getOne.mockResolvedValue(mockVirtualGym);
        mockService.findOneBy.mockResolvedValue(mockPerson);

        VirtualGymFetchSingleController['service'] = mockService as any;
        VirtualGymFetchSingleController['personService'] = mockService as any;

        const okSpy = jest
          .spyOn(VirtualGymFetchSingleController, 'ok')
          .mockReturnValue({} as any);

        await VirtualGymFetchSingleController.execute(mockReq, mockRes);

        expect(mockService.findOneBy).toHaveBeenCalledTimes(1);
        expect(mockService.findOneBy).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
          alias: 'virtualGym'
        });
        expect(mockService.innerJoinAndMapMany).toHaveBeenCalledTimes(1);
        expect(mockService.innerJoinAndMapMany).toHaveBeenCalledWith(
          'virtualGym.gymZones',
          'virtualGym.gymZones',
          'gz'
        );
        expect(mockService.innerJoinAndMapMany).toHaveBeenCalledTimes(1);
        expect(mockService.innerJoinAndMapOne).toHaveBeenCalledWith(
          'gz.calendar',
          'gz.calendar',
          'c'
        );
        expect(mockService.where).toHaveBeenCalledTimes(2);
        expect(mockService.where).toHaveBeenNthCalledWith(
          1,
          'virtualGym.id = :id',
          { id: mockReq.params.id }
        );
        expect(mockService.where).toHaveBeenNthCalledWith(
          2,
          'virtualGym.gym = :gym',
          { gym: mockPerson.gym.id }
        );
        expect(mockService.getOne).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes, mockDto);
      });

      it('should call fail on person service error', async () => {
        await onPersonServiceError(VirtualGymFetchSingleController);
      });

      it('should call clientError if person does not exist', async () => {
        await onClientErrorFail(VirtualGymFetchSingleController);
      });

      it('should call fail on service error', async () => {
        await onServiceFail(VirtualGymFetchSingleController, 'getOne');
      });
    });
  });

  describe('VirtualGymCreateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(VirtualGymCreateController, 'fail').mockImplementation();

      VirtualGymCreateController['service'] = undefined;
      VirtualGymCreateController['ownerService'] = undefined;
      await VirtualGymCreateController.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalled();
    });

    it('should call createdByOwner', async () => {
      const cboSpy = jest.spyOn(create, 'createdByOwner').mockImplementation();
      const fromJsonSpy = jest
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);

      VirtualGymCreateController['service'] = {} as any;
      VirtualGymCreateController['ownerService'] = {} as any;

      await VirtualGymCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboSpy).toHaveBeenCalledTimes(1);
      expect(cboSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        controller: VirtualGymCreateController,
        res: mockRes,
        fromClass: VirtualGymDTO.fromClass,
        token: mockRes.locals.token,
        dto: mockDto,
        entityName: 'VirtualGym'
      });
    });

    it('should call forbidden if user is not an owner', async () => {
      const cboSpy = jest.spyOn(create, 'createdByOwner').mockImplementation();
      const forbiddenSpy = jest
        .spyOn(VirtualGymCreateController, 'forbidden')
        .mockImplementation();

      VirtualGymCreateController['service'] = {} as any;
      VirtualGymCreateController['ownerService'] = {} as any;

      await VirtualGymCreateController.execute(mockReq, {
        locals: { token: { id: 1, user: 'worker' } }
      } as any);

      expect(cboSpy).not.toHaveBeenCalled();
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        { locals: { token: { id: 1, user: 'worker' } } },
        'User can not create Virtual Gyms.'
      );
    });

    it('should call clientError on fromJson error', async () => {
      const cboSpy = jest.spyOn(create, 'createdByOwner').mockImplementation();
      const fromJsonSpy = jest
        .spyOn(VirtualGymDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');

      const clientErrorSpy = jest
        .spyOn(VirtualGymCreateController, 'clientError')
        .mockImplementation();

      VirtualGymCreateController['service'] = {} as any;
      VirtualGymCreateController['ownerService'] = {} as any;

      await VirtualGymCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, 'fromJson-error');
    });
  });

  describe('VirtualGymUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(VirtualGymDTO, 'fromJson');

      expect(VirtualGymUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(VirtualGymUpdateController['serviceCtr']).toBe(VirtualGymService);
      expect(VirtualGymUpdateController['fromJson']).toBe(
        VirtualGymDTO.fromJson
      );
      expect(VirtualGymUpdateController['entityName']).toBe('VirtualGym');
      expect(VirtualGymUpdateController['workerUpdatePermission']).toBe(
        'updateVirtualGyms'
      );
    });
  });

  describe('VirtualGymDeleteController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(VirtualGymDeleteController, 'fail').mockImplementation();

      VirtualGymDeleteController['service'] = undefined;
      VirtualGymDeleteController['ownerService'] = undefined;
      await VirtualGymDeleteController.execute({} as any, {} as any);

      expect(VirtualGymService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalled();
    });

    it('should call deletedByOwner', async () => {
      const dboSpy = jest
        .spyOn(deleteHelpers, 'deletedByOwner')
        .mockImplementation();

      VirtualGymDeleteController['service'] = {} as any;
      VirtualGymDeleteController['ownerService'] = {} as any;

      await VirtualGymDeleteController.execute(
        { ...mockReq, params: { id: 1 } },
        mockRes
      );

      expect(dboSpy).toHaveBeenCalledTimes(1);
      expect(dboSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        controller: VirtualGymDeleteController,
        res: mockRes,
        token: mockRes.locals.token,
        entityId: 1,
        entityName: 'VirtualGym',
        countArgs: { id: 1 }
      });
    });

    it('should call forbidden if user is not an owner', async () => {
      const cboSpy = jest
        .spyOn(deleteHelpers, 'deletedByOwner')
        .mockImplementation();
      const forbiddenSpy = jest
        .spyOn(VirtualGymDeleteController, 'forbidden')
        .mockImplementation();

      VirtualGymDeleteController['service'] = {} as any;
      VirtualGymDeleteController['ownerService'] = {} as any;

      await VirtualGymDeleteController.execute(mockReq, {
        locals: { token: { id: 1, user: 'worker' } }
      } as any);

      expect(cboSpy).not.toHaveBeenCalled();
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        { locals: { token: { id: 1, user: 'worker' } } },
        'User can not delete Virtual Gyms.'
      );
    });
  });
});
