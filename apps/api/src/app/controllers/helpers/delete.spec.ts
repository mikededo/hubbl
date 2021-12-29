import { Owner, Worker } from '@gymman/shared/models/entities';

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
        const softDeleteSpy = jest
          .spyOn(service, 'softDelete')
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
          entityName: 'VirtualGym',
          workerDeletePermission: 'any' as any
        });

        // Common checks
        expect(softDeleteSpy).toHaveBeenCalledTimes(1);
        expect(softDeleteSpy).toHaveBeenCalledWith(1);
        expect(mockController.ok).toHaveBeenCalledTimes(1);
        expect(mockController.ok).toHaveBeenCalledWith(mockRes);
      };

      it('should delete by owner', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          softDelete: jest.fn()
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
          softDelete: jest.fn()
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
        entityName: 'any' as any
      });

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
        workerDeletePermission: 'any' as any
      });

      expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOne).toHaveBeenCalledWith(1);
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
        entityName: 'VirtualGym',
        workerDeletePermission: 'delete' as any
      });

      expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
      expect(mockWorkerService.findOne).toHaveBeenCalledWith(1);
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
        entityName: 'any' as any
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
        entityName: 'any' as any
      });

      expect(mockController.unauthorized).toHaveReturnedTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        {},
        'Ensure to pass the [by] parameter. Valid values are ["owner", "worker"].'
      );
    });

    it('should send fail if error on softDelete', async () => {
      fromClassSpy.mockResolvedValue(mockEntityDto);
      const mockService = {
        count: jest.fn().mockResolvedValue(1),
        softDelete: jest.fn().mockRejectedValue(mockEntity as any)
      } as any;

      const mockRes = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis()
      } as any;

      await deleteHelpers.deletedByOwnerOrWorker({
        controller: mockController,
        service: mockService,
        ownerService: mockService,
        workerService: undefined,
        res: mockRes,
        by: 'owner',
        token: { id: 1, email: 'test@user.com', exp: Date.now() },
        entityId: 1,
        entityName: 'VirtualGym',
        workerDeletePermission: 'any' as any
      });

      // Common checks
      expect(mockService.softDelete).toHaveBeenCalledTimes(1);
      expect(mockService.softDelete).toHaveBeenCalledWith(1);
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        mockRes,
        'Internal server error. If the error persists, contact our team.'
      );
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
        entityName: 'Any' as any
      });

      expect(dboowSpy).toHaveBeenCalledTimes(1),
        expect(dboowSpy).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: undefined,
          controller: mockController,
          res: {},
          token: {},
          by: 'owner',
          entityId: 1,
          entityName: 'Any'
        });
    });
  });
});
