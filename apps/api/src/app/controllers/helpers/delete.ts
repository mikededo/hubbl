import { Response } from 'express';

import { Owner, VirtualGym, Worker } from '@gymman/shared/models/entities';

import { BaseService } from '../../services';
import BaseController from '../Base';
import { ParsedToken } from './types';

type CommonDeleteByServices = BaseService<VirtualGym>;

type CommonDeleteByEntities = 'VirtualGym';

type WorkerDeletePermissions =
  | 'deleteClients'
  | 'deleteEventTypes'
  | 'deleteEvents'
  | 'deleteGymZones'
  | 'deleteTrainers';

type DeletedByOwnerOrWorkerProps = {
  service: CommonDeleteByServices;
  ownerService: BaseService<Owner>;
  workerService: BaseService<Worker>;
  controller: BaseController;
  res: Response;
  token: ParsedToken;
  by: 'worker' | 'owner';
  entityId: string | number;
  entityName: CommonDeleteByEntities;
  workerDeletePermission?: WorkerDeletePermissions;
};

export const deletedByOwnerOrWorker = async ({
  service,
  ownerService,
  workerService,
  controller,
  res,
  token,
  by,
  entityId,
  entityName,
  workerDeletePermission
}: DeletedByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (by === 'worker') {
    if (!workerDeletePermission) {
      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team'
      );
    }

    const worker = await workerService.findOne(token.id);

    if (!worker) {
      return controller.unauthorized(
        res,
        `Worker does not exist. Can not delete the ${entityName.toLowerCase()}.`
      );
    } else if (!worker[workerDeletePermission]) {
      return controller.unauthorized(
        res,
        'Worker does not have enough permissions.'
      );
    }
  } else if (by === 'owner') {
    const count = await ownerService.count({ person: { id: token.id } });

    if (!count) {
      return controller.unauthorized(
        res,
        `Owner does not exist. Can not delete the ${entityName.toLowerCase()}.`
      );
    }
  } else {
    return controller.unauthorized(
      res,
      'Ensure to pass the [by] parameter. Valid values are ["owner", "worker"].'
    );
  }

  try {
    // If valid, update the entity
    await service.softDelete(entityId);

    // Return ok
    return controller.ok(res);
  } catch (_) {
    return controller.fail(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  }
};

type DeletedByOwner = Pick<
  DeletedByOwnerOrWorkerProps,
  | 'service'
  | 'ownerService'
  | 'controller'
  | 'res'
  | 'token'
  | 'entityId'
  | 'entityName'
>;

/**
 * Deletes an entity by an owner. It should only be used when such
 * entity can not be deleted by workers nor clients.
 */
export const deletedByOwner = ({
  service,
  ownerService,
  controller,
  res,
  token,
  entityId,
  entityName
}: DeletedByOwner) =>
  deletedByOwnerOrWorker({
    service,
    ownerService,
    workerService: undefined,
    controller,
    res,
    token,
    by: 'owner',
    entityId,
    entityName
  });
