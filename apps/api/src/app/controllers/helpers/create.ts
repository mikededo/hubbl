import { Response } from 'express';
import * as log from 'npmlog';

import {
  EventTypeDTO,
  GymZoneDTO,
  TrainerDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import {
  EventType,
  Gym,
  GymZone,
  Owner,
  Trainer,
  VirtualGym,
  Worker
} from '@hubbl/shared/models/entities';

import { BaseService } from '../../services';
import BaseController from '../Base';
import { BaseFromClassCallable, ParsedToken } from './types';

type CommonCreateByServices = BaseService<
  EventType | VirtualGym | GymZone | Trainer
>;

type CommonCreateByDTOs =
  | EventTypeDTO
  | VirtualGymDTO
  | GymZoneDTO
  | TrainerDTO<Gym | number>;

type CommonCreateByEntities =
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone'
  | 'Trainer';

type WorkerCreatePermissions =
  | 'createClients'
  | 'createEventTypes'
  | 'createEvents'
  | 'createGymZones'
  | 'createTrainers';

type FromClassCallables =
  | BaseFromClassCallable<EventType, EventTypeDTO>
  | BaseFromClassCallable<VirtualGym, VirtualGymDTO>
  | BaseFromClassCallable<GymZone, GymZoneDTO>;

type CreatedByOwnerOrWorkerProps = {
  service: CommonCreateByServices;
  ownerService: BaseService<Owner>;
  workerService: BaseService<Worker>;
  controller: BaseController;
  res: Response;
  fromClass: FromClassCallables;
  token: ParsedToken;
  by: 'worker' | 'owner';
  dto: CommonCreateByDTOs;
  entityName: CommonCreateByEntities;
  workerCreatePermission?: WorkerCreatePermissions;
};

export const createdByOwnerOrWorker = async ({
  service,
  ownerService,
  workerService,
  controller,
  res,
  fromClass,
  token,
  by,
  dto,
  entityName,
  workerCreatePermission
}: CreatedByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (by === 'worker') {
    if (!workerCreatePermission) {
      log.error(
        `Controller[${controller.constructor.name}]`,
        '"fetch" handler',
        'No "workerCreatePermission" passed'
      );

      return controller.fail(
        res,
        'Internal server error. If the error persists, contact our team'
      );
    }

    const worker = await workerService.findOne(token.id);

    if (!worker) {
      return controller.unauthorized(
        res,
        `Worker does not exist. Can not create the ${entityName.toLowerCase()}.`
      );
    } else if (!worker[workerCreatePermission]) {
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
        `Owner does not exist. Can not create the ${entityName.toLowerCase()}.`
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
    const result = await service.save(await dto.toClass());

    // Return ok
    return controller.created(res, await fromClass(result as any));
  } catch (_) {
    log.error(
      `Controller[${controller.constructor.name}]`,
      '"fetch" handler',
      _.toString()
    );

    return controller.fail(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  }
};

type CreatedByOwner = Pick<
  CreatedByOwnerOrWorkerProps,
  | 'service'
  | 'ownerService'
  | 'controller'
  | 'res'
  | 'fromClass'
  | 'token'
  | 'dto'
  | 'entityName'
>;

/**
 * Creates an entity by an owner. It should only be used when such
 * entity can not be created by workers nor clients.
 */
export const createdByOwner = ({
  service,
  ownerService,
  controller,
  res,
  fromClass,
  dto,
  token,
  entityName
}: CreatedByOwner) =>
  createdByOwnerOrWorker({
    service,
    ownerService,
    workerService: undefined,
    controller,
    res,
    fromClass,
    dto,
    token,
    by: 'owner',
    entityName
  });
