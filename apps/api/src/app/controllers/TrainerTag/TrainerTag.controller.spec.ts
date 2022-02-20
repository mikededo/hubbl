import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { DTOGroups, TrainerTagDTO } from '@hubbl/shared/models/dto';
import { AppPalette } from '@hubbl/shared/types';

import {
  OwnerService,
  PersonService,
  TrainerTagService,
  WorkerService
} from '../../services';
import * as create from '../helpers/create';
import * as update from '../helpers/update';
import * as deleteHelpers from '../helpers/delete';
import {
  TrainerTagCreateController,
  TrainerTagDeleteController,
  TrainerTagFetchController,
  TrainerTagUpdateController
} from './TrainerTag.controller';

jest.mock('npmlog');
jest.mock('@hubbl/shared/models/dto');
jest.mock('../../services');

type FailControllers = typeof TrainerTagFetchController;

type Operations = 'fetch';

describe('TrainerTag controller', () => {
  const logSpy = jest.spyOn(log, 'error');

  const failAsserts = (
    controller: FailControllers,
    operation: Operations,
    res: any,
    failSpy: jest.SpyInstance
  ) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      `Controller [${controller.constructor.name}]`,
      `"${operation}" handler`,
      'error-thrown'
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  describe('TrainerTagFetchController', () => {
    const mockPerson = { id: 1, gym: { id: 2 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    const mockPersonService = { findOne: jest.fn() };
    const mockTagService = { find: jest.fn() };

    const fromClassSpy = jest.spyOn(TrainerTagDTO, 'fromClass');
    const failSpy = jest.spyOn(TrainerTagFetchController, 'fail');

    beforeEach(() => {
      jest.clearAllMocks();

      failSpy.mockImplementation();
    });

    const setupServices = () => {
      TrainerTagFetchController['service'] = mockTagService as any;
      TrainerTagFetchController['personService'] = mockPersonService as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TrainerTagFetchController, 'fail');

      TrainerTagFetchController['service'] = undefined;
      TrainerTagFetchController['personService'] = undefined;

      await TrainerTagFetchController.execute({} as any, {} as any);

      expect(TrainerTagService).toHaveBeenCalledTimes(1);
      expect(TrainerTagService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should return the list of TrainerTags as owner or worker', async () => {
      fromClassSpy.mockReturnValue({} as any);
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockTagService.find.mockResolvedValue([{}, {}]);

      const okSpy = jest
        .spyOn(TrainerTagFetchController, 'ok')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id,
        options: { select: ['id', 'gym'] }
      });
      expect(mockTagService.find).toHaveBeenCalledTimes(1);
      expect(mockTagService.find).toHaveBeenCalledWith({
        where: { gym: mockPerson.gym.id }
      });
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(fromClassSpy).toHaveBeenCalledWith({});
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, [{}, {}]);
    });

    it('should send forbidden if request is made by a client', async () => {
      const forbiddenSpy = jest
        .spyOn(TrainerTagFetchController, 'forbidden')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockClientRes as any);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockClientRes,
        'User does not have permissions.'
      );
    });

    it('should send unauthorized if person does not exist', async () => {
      mockPersonService.findOne.mockResolvedValue(undefined);
      const unauthorizedSpy = jest
        .spyOn(TrainerTagFetchController, 'unauthorized')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist.'
      );
    });

    it('should call fail on personService error', async () => {
      mockPersonService.findOne.mockRejectedValue('error-thrown');

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(TrainerTagFetchController, 'fetch', mockRes, failSpy);
    });

    it('should call fail on service error', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockTagService.find.mockRejectedValue('error-thrown');

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagService.find).toHaveBeenCalledTimes(1);
      failAsserts(TrainerTagFetchController, 'fetch', mockRes, failSpy);
    });
  });

  describe('TrainerTagCreateController', () => {
    const mockReq = { body: { name: 'Tag', color: AppPalette.BLUE } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    const cboowSpy = jest.spyOn(create, 'createdByOwnerOrWorker');
    const fromJsonSpy = jest.spyOn(TrainerTagDTO, 'fromJson');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      TrainerTagCreateController['service'] = {} as any;
      TrainerTagCreateController['ownerService'] = {} as any;
      TrainerTagCreateController['workerService'] = {} as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TrainerTagCreateController, 'fail').mockImplementation();

      TrainerTagCreateController['service'] = undefined;
      TrainerTagCreateController['ownerService'] = undefined;
      TrainerTagCreateController['workerService'] = undefined;

      await TrainerTagCreateController.execute({} as any, {} as any);

      expect(TrainerTagService).toHaveBeenCalledTimes(1);
      expect(TrainerTagService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call createdByOwnerOrWorker', async () => {
      fromJsonSpy.mockResolvedValue({} as any);
      cboowSpy.mockImplementation();

      setupServices();
      await TrainerTagCreateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: TrainerTagCreateController,
        res: mockRes,
        fromClass: TrainerTagDTO.fromClass,
        token: mockRes.locals.token,
        dto: {},
        entityName: 'TrainerTag',
        workerCreatePermission: 'createTags'
      });
    });

    it('should send forbidden if user is not an owner nor a worker', async () => {
      const forbiddenSpy = jest
        .spyOn(TrainerTagCreateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await TrainerTagCreateController.execute(
        mockReq as any,
        mockClientRes as any
      );

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockClientRes,
        'User does not have permissions.'
      );
    });
  });

  describe('TrainerTagUpdateController', () => {
    const mockReq = {
      body: { name: 'Tag', color: AppPalette.BLUE },
      params: { id: 1 }
    };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    const uboowSpy = jest.spyOn(update, 'updatedByOwnerOrWorker');
    const fromJsonSpy = jest.spyOn(TrainerTagDTO, 'fromJson');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      TrainerTagUpdateController['service'] = {} as any;
      TrainerTagUpdateController['ownerService'] = {} as any;
      TrainerTagUpdateController['workerService'] = {} as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TrainerTagUpdateController, 'fail').mockImplementation();

      TrainerTagUpdateController['service'] = undefined;
      TrainerTagUpdateController['ownerService'] = undefined;
      TrainerTagUpdateController['workerService'] = undefined;

      await TrainerTagUpdateController.execute({} as any, {} as any);

      expect(TrainerTagService).toHaveBeenCalledTimes(1);
      expect(TrainerTagService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call updatedByOwnerOrWorker', async () => {
      fromJsonSpy.mockResolvedValue({} as any);
      uboowSpy.mockImplementation();

      setupServices();
      await TrainerTagUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(uboowSpy).toHaveBeenCalledTimes(1);
      expect(uboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: TrainerTagUpdateController,
        res: mockRes,
        token: mockRes.locals.token,
        dto: {},
        entityName: 'TrainerTag',
        countArgs: { id: mockReq.params.id },
        workerUpdatePermission: 'updateTags'
      });
    });

    it('should send forbidden if user is not an owner nor a worker', async () => {
      const forbiddenSpy = jest
        .spyOn(TrainerTagUpdateController, 'forbidden')
        .mockImplementation();

      setupServices();
      await TrainerTagUpdateController.execute(
        mockReq as any,
        mockClientRes as any
      );

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockClientRes,
        'User does not have permissions.'
      );
    });

    it('should send clientError if no id passed', async () => {
      const clientErrorSpy = jest
        .spyOn(TrainerTagUpdateController, 'clientError')
        .mockImplementation();

      setupServices();
      await TrainerTagUpdateController.execute(
        { ...mockReq, params: {} } as any,
        mockRes as any
      );

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'No TrainerTag id given.'
      );
    });
  });

  describe('TrainerTagUpdateController', () => {
    const mockReq = {
      body: { name: 'Tag', color: AppPalette.BLUE },
      params: { id: 1 }
    };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    const uboowSpy = jest.spyOn(deleteHelpers, 'deletedByOwnerOrWorker');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      TrainerTagDeleteController['service'] = {} as any;
      TrainerTagDeleteController['ownerService'] = {} as any;
      TrainerTagDeleteController['workerService'] = {} as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TrainerTagDeleteController, 'fail').mockImplementation();

      TrainerTagDeleteController['service'] = undefined;
      TrainerTagDeleteController['ownerService'] = undefined;
      TrainerTagDeleteController['workerService'] = undefined;

      await TrainerTagDeleteController.execute({} as any, {} as any);

      expect(TrainerTagService).toHaveBeenCalledTimes(1);
      expect(TrainerTagService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call deletedByOwnerOrWorker', async () => {
      uboowSpy.mockImplementation();

      setupServices();
      await TrainerTagDeleteController.execute(mockReq as any, mockRes as any);

      expect(uboowSpy).toHaveBeenCalledTimes(1);
      expect(uboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: TrainerTagDeleteController,
        res: mockRes,
        token: mockRes.locals.token,
        entityId: mockReq.params.id,
        entityName: 'TrainerTag',
        countArgs: { id: mockReq.params.id },
        workerDeletePermission: 'deleteTags'
      });
    });

    it('should send forbidden if user is not an owner nor a worker', async () => {
      const forbiddenSpy = jest
        .spyOn(TrainerTagDeleteController, 'forbidden')
        .mockImplementation();

      setupServices();
      await TrainerTagDeleteController.execute(
        mockReq as any,
        mockClientRes as any
      );

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockClientRes,
        'User does not have permissions.'
      );
    });

    it('should send clientError if no id passed', async () => {
      const clientErrorSpy = jest
        .spyOn(TrainerTagDeleteController, 'clientError')
        .mockImplementation();

      setupServices();
      await TrainerTagDeleteController.execute(
        { ...mockReq, params: {} } as any,
        mockRes as any
      );

      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'No TrainerTag id given.'
      );
    });
  });
});
