import * as log from 'npmlog';

import { Owner, Worker } from '@hubbl/shared/models/entities';

import { BaseService } from '../../services';
import * as deleteHelpers from './delete';

type CommonShouldDeleteByProps = {
  service: BaseService<any>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  by: 'owner' | 'worker';
};

describe('delete', () => {
  const mockEntity = { id: 1, argOne: 'ArgOne', argTwo: 'ArgTwo' };
  const mockEntityDto = {
    ...mockEntity,
    toClass: jest.fn().mockReturnValue(mockEntity)
  } as any;

  const mockController = {
    clientError: jest.fn(),
    deleted: jest.fn(),
    execute: jest.fn(),
    fail: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    ok: jest.fn(),
    run: jest.fn(),
    unauthorized: jest.fn()
  } as any;

  const logSpy = jest.spyOn(log, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const failAsserts = () => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      `Controller[${mockController.constructor.name}]`,
      `"delete" handler`,
      'error-thrown'
    );

    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      {},
      'Internal server error. If the error persists, contact our team'
    );
  };

  describe('deletedByOwnerOrWorker', () => {
    let fromClassSpy: any;

    beforeEach(() => {
      jest.clearAllMocks();

      fromClassSpy = jest.fn();
    });

    describe('Successfull deletes', () => {
      const shouldDeleteBy = async ({
        service,
        ownerService = {} as any,
        workerService = {} as any,
        by
      }: CommonShouldDeleteByProps) => {
        fromClassSpy.mockResolvedValue(mockEntityDto);
        const countSpy = jest.spyOn(service, 'count').mockResolvedValue(1);
        const deleteSpy = jest
          .spyOn(service, 'delete')
          .mockResolvedValue(mockEntity as any);
        const mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis()
        } as any;

        await deleteHelpers.deletedByOwnerOrWorker({
          controller: mockController,
          service: service,
          ownerService,
          workerService,
          res: mockRes,
          by,
          token: { id: 1, email: 'test@user.com', exp: Date.now() },
          entityId: 1,
          entityName: 'Entity' as any,
          countArgs: { any: 'any' },
          workerDeletePermission: 'any' as any
        });

        // Common checks
        expect(countSpy).toHaveBeenCalledTimes(1);
        expect(countSpy).toHaveBeenCalledWith({ any: 'any' });
        expect(deleteSpy).toHaveBeenCalledTimes(1);
        expect(deleteSpy).toHaveBeenCalledWith(1);
        expect(mockController.ok).toHaveBeenCalledTimes(1);
        expect(mockController.ok).toHaveBeenCalledWith(mockRes);
      };

      it('should delete by owner', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          delete: jest.fn()
        } as any;
        const mockOwnerService = {
          count: jest.fn().mockResolvedValue(1)
        } as any;

        await shouldDeleteBy({
          service: mockService,
          ownerService: mockOwnerService,
          by: 'owner'
        });

        expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      });

      it('should delete by worker', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          delete: jest.fn()
        } as any;
        const mockWorkerService = {
          findOne: jest.fn().mockResolvedValue({ any: true })
        } as any;

        await shouldDeleteBy({
          service: mockService,
          workerService: mockWorkerService,
          by: 'worker'
        });

        expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
      });
    });

    it('should send fail if no workerDeletePermission passed', async () => {
      const mockWorkerService = { findOne: jest.fn() };

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        workerService: mockWorkerService as any,
        ownerService: {} as any,
        res: {} as any,
        token: {} as any,
        by: 'worker',
        entityId: 1,
        entityName: 'any' as any,
        countArgs: {}
      });

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        `Controller[${mockController.constructor.name}]`,
        '"delete" handler',
        'No "workerCreatePermission" passed'
      );
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {},
        'Internal server error. If the error persists, contact our team'
      );
      expect(mockWorkerService.findOne).not.toHaveBeenCalled();
    });

    it('should send unauthorized if worker updating does not exist', async () => {
      const mockWorkerService = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        workerService: mockWorkerService as any,
        ownerService: {} as any,
        res: {} as any,
        token: { id: 1 } as any,
        by: 'worker',
        entityId: 1,
        entityName: 'any' as any,
        countArgs: {},
        workerDeletePermission: 'any' as any
      });

      expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Worker does not exist. Can not delete the any.'
      );
    });

    it('should send unauthorized if worker does not have permissions to delete', async () => {
      const mockWorkerService = {
        findOne: jest.fn().mockResolvedValue({ delete: false })
      } as any;

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: {} as any,
        workerService: mockWorkerService,
        res: {} as any,
        token: { id: 1 } as any,
        by: 'worker',
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: {},
        workerDeletePermission: 'delete' as any
      });

      expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Worker does not have enough permissions.'
      );
    });

    it('should send unauthorized if owner updating does not exist', async () => {
      const mockOwnerService = {
        count: jest.fn().mockResolvedValue(0)
      } as any;

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: mockOwnerService,
        workerService: {} as any,
        res: {} as any,
        token: { id: 1 } as any,
        by: 'owner',
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: {}
      });

      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledWith({
        person: { id: 1 }
      });
      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Owner does not exist. Can not delete the any.'
      );
    });

    it('should send unauthorized if by param is not valid', async () => {
      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: {} as any,
        ownerService: {} as any,
        workerService: {} as any,
        res: {} as any,
        token: {} as any,
        by: 'any' as any,
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: {}
      });

      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Ensure to pass the [by] parameter. Valid values are ["owner", "worker"].'
      );
    });

    it('should send not found if entity to update does not exist', async () => {
      fromClassSpy.mockResolvedValue(mockEntityDto);
      const mockService = {
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn().mockRejectedValue('error-thrown')
      } as any;
      const mockOwnerService = { count: jest.fn().mockResolvedValue(1) } as any;

      const mockRes = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis()
      } as any;

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: mockService,
        ownerService: mockOwnerService,
        workerService: undefined,
        res: mockRes,
        by: 'owner',
        token: { id: 1, email: 'test@user.com', exp: Date.now() },
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: { id: 1 },
        workerDeletePermission: 'any' as any
      });

      // Common checks
      expect(mockService.count).toHaveBeenCalledTimes(1);
      expect(mockService.count).toHaveBeenCalledWith({ id: 1 });
      expect(mockService.delete).not.toHaveBeenCalled();
      expect(mockController.notFound).toHaveBeenCalledTimes(1);
      expect(mockController.notFound).toHaveBeenCalledWith(
        mockRes,
        'Any to delete not found.'
      );
    });

    it('should send fail if error on delete', async () => {
      fromClassSpy.mockResolvedValue(mockEntityDto);
      const mockService = {
        count: jest.fn().mockResolvedValue(1),
        delete: jest.fn().mockRejectedValue('error-thrown')
      } as any;
      const mockOwnerService = { count: jest.fn().mockResolvedValue(1) } as any;

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: mockService,
        ownerService: mockOwnerService,
        workerService: undefined,
        res: {} as any,
        by: 'owner',
        token: { id: 1, email: 'test@user.com', exp: Date.now() },
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: { id: 1 },
        workerDeletePermission: 'any' as any
      });

      // Common checks
      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(1);

      failAsserts();
    });
  });

  describe('deleteByOwner', () => {
    it('should call deletedByOwnerOrWorker', async () => {
      const dboowSpy = jest
        .spyOn(deleteHelpers, 'deletedByOwnerOrWorker')
        .mockImplementation();

      await deleteHelpers.deletedByOwner({
        service: {} as any,
        ownerService: {} as any,
        controller: mockController,
        res: {} as any,
        token: {} as any,
        entityId: 1,
        entityName: 'Any' as any,
        countArgs: {}
      });

      expect(dboowSpy).toHaveBeenCalledTimes(1);
      expect(dboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: undefined,
        controller: mockController,
        res: {},
        token: {},
        by: 'owner',
        entityId: 1,
        entityName: 'Any',
        countArgs: {}
      });
    });
  });

  describe('deleteByClient', () => {
    const mockService = {
      count: jest.fn(),
      delete: jest.fn()
    };
    const mockClientService = { count: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete by client', async () => {
      mockClientService.count.mockResolvedValue(1);
      mockService.count.mockResolvedValue(1);

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.count).toHaveBeenCalledWith({
        person: { id: 1 }
      });
      expect(mockService.count).toHaveBeenCalledTimes(1);
      expect(mockService.count).toHaveBeenCalledWith({ id: mockEntity.id });
      expect(mockService.delete).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledWith(mockEntity.id);
      expect(mockController.ok).toHaveBeenCalledTimes(1);
      expect(mockController.ok).toHaveBeenCalledWith({} as any);
    });

    it('should call unauthorized if client does not exist', async () => {
      mockClientService.count.mockResolvedValue(0);

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {} as any,
        'Client does not exist.'
      );
    });

    it('should call fail on clientService error', async () => {
      mockClientService.count.mockRejectedValue('error-thrown');

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      failAsserts();
    });

    it('should call forbidden if entity does not exist', async () => {
      mockClientService.count.mockResolvedValue(1);
      mockService.count.mockResolvedValue(0);

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      expect(mockService.count).toHaveBeenCalledTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledTimes(1);
      expect(mockController.forbidden).toHaveBeenCalledWith(
        {} as any,
        'Client does not have permissions to delete the EntityName.'
      );
    });

    it('should call fail on service.count error', async () => {
      mockClientService.count.mockResolvedValue(1);
      mockService.count.mockRejectedValue('error-thrown');

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      expect(mockService.count).toHaveBeenCalledTimes(1);
      failAsserts();
    });

    it('should call fail on service.delete error', async () => {
      mockClientService.count.mockResolvedValue(1);
      mockService.count.mockResolvedValue(1);
      mockService.delete.mockRejectedValue('error-thrown');

      await deleteHelpers.deletedByClient({
        service: mockService as any,
        clientService: mockClientService as any,
        controller: mockController,
        res: {} as any,
        clientId: 1,
        entityId: mockEntity.id,
        entityName: 'EntityName' as any,
        countArgs: { id: mockEntity.id }
      });

      expect(mockClientService.count).toHaveBeenCalledTimes(1);
      expect(mockService.count).toHaveBeenCalledTimes(1);
      expect(mockService.delete).toHaveBeenCalledTimes(1);
      failAsserts();
    });
  });
});
