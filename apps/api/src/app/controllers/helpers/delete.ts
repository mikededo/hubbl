import { Response } from 'express';
import * as log from 'npmlog';

import {
  CalendarAppointment,
  Client,
  Event,
  EventAppointment,
  EventTemplate,
  EventType,
  GymZone,
  Owner,
  VirtualGym,
  Worker
} from '@hubbl/shared/models/entities';

import { BaseService } from '../../services';
import BaseController from '../Base';
import { ParsedToken } from './types';

/* Common on fail call */
const onFail = (controller: BaseController, res: Response, error: any) => {
  log.error(
    `Controller[${controller.constructor.name}]`,
    `"delete" handler`,
    error.toString()
  );

  return controller.fail(
    res,
    'Internal server error. If the error persists, contact our team'
  );
};

type CommonDeleteByServices =
  | BaseService<CalendarAppointment>
  | BaseService<Event>
  | BaseService<EventAppointment>
  | BaseService<EventTemplate>
  | BaseService<EventType>
  | BaseService<VirtualGym>
  | BaseService<GymZone>;

type CommonDeleteByEntities =
  | 'CalendarAppointment'
  | 'Event'
  | 'EventAppointment'
  | 'EventTemplate'
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone';

type WorkerDeletePermissions =
  | 'deleteCalendarAppointments'
  | 'deleteClients'
  | 'deleteEvents'
  | 'deleteEventAppointments'
  | 'deleteEventTemplates'
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
  entityId: string | number;
  entityName: CommonDeleteByEntities;
  countArgs: any;
  workerDeletePermission?: WorkerDeletePermissions;
};

export const deletedByOwnerOrWorker = async ({
  service,
  ownerService,
  workerService,
  controller,
  res,
  token,
  entityId,
  entityName,
  countArgs,
  workerDeletePermission
}: DeletedByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (token.user === 'worker') {
    if (!workerDeletePermission) {
      log.error(
        `Controller[${controller.constructor.name}]`,
        '"delete" handler',
        'No "workerCreatePermission" passed'
      );

      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team'
      );
    }

    const worker = await workerService.findOne({ id: token.id });

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
  } else if (token.user === 'owner') {
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
      'Client can not perform such operation.'
    );
  }

  if (!(await service.count(countArgs))) {
    return controller.notFound(res, `${entityName} to delete not found.`);
  }

  try {
    // If valid, update the entity
    await service.delete(entityId);

    // Return ok
    return controller.ok(res);
  } catch (_) {
    return onFail(controller, res, _);
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
  | 'countArgs'
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
  entityName,
  countArgs
}: DeletedByOwner) =>
  deletedByOwnerOrWorker({
    service,
    ownerService,
    workerService: undefined,
    controller,
    res,
    token,
    entityId,
    entityName,
    countArgs
  });

type DeleteByClientEntityNames = 'CalendarAppointment' | 'EventAppointment';

type DeleteByClient<T> = {
  service: BaseService<T>;
  clientService: BaseService<Client>;
  controller: BaseController;
  res: Response;
  clientId: number;
  entityId: string | number;
  entityName: DeleteByClientEntityNames;
  countArgs: Partial<T>;
};

export const deletedByClient = async <T>({
  service,
  clientService,
  controller,
  res,
  clientId,
  entityId,
  entityName,
  countArgs
}: DeleteByClient<T>) => {
  try {
    const count = await clientService.count({ person: { id: clientId } });

    if (!count) {
      return controller.unauthorized(res, 'Client does not exist.');
    }
  } catch (e) {
    return onFail(controller, res, e);
  }

  try {
    // Check if the entity exists
    const count = await service.count(countArgs);
    if (!count) {
      return controller.forbidden(
        res,
        `Client does not have permissions to delete the ${entityName}.`
      );
    }
  } catch (e) {
    return onFail(controller, res, e);
  }

  try {
    await service.delete(entityId);

    return controller.ok(res);
  } catch (e) {
    return onFail(controller, res, e);
  }
};
