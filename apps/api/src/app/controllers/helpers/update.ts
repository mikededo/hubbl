import { Request, Response } from 'express';
import * as log from 'npmlog';

import {
  ClientDTO,
  DTO,
  DTOGroups,
  EventTypeDTO,
  GymZoneDTO,
  OwnerDTO,
  TrainerDTO,
  VirtualGymDTO,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import {
  Client,
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
import { ParsedToken } from './types';

/* COMMON UPDATERS */

type UpdatableServices =
  | BaseService<Owner>
  | BaseService<Worker>
  | BaseService<Trainer>
  | BaseService<Client>
  | BaseService<EventType>
  | BaseService<VirtualGym>
  | BaseService<GymZone>;

type UpdatableEntities =
  | 'Owner'
  | 'Worker'
  | 'Trainer'
  | 'Client'
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone';

type FindAndUpdateProps = {
  controller: BaseController;
  service: UpdatableServices;
  res: Response;
  dto: DTO<any>;
  entityName: UpdatableEntities;
  countArgs: any;
};

export const findAndUpdateEntity = async ({
  controller,
  service,
  res,
  dto,
  entityName,
  countArgs
}: FindAndUpdateProps): Promise<Response> => {
  // Search for the entity
  if (!(await service.count(countArgs))) {
    return controller.notFound(res, `${entityName} to update not found.`);
  }

  try {
    // If valid, update the entity
    await service.save(await dto.toClass());

    // Return ok
    return controller.ok(res);
  } catch (_) {
    log.error(
      `Controller[${controller.constructor.name}]`,
      '"update" handler',
      _.toString()
    );

    return controller.fail(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  }
};

type CommonUpdateByServices =
  | BaseService<Owner>
  | BaseService<Worker>
  | BaseService<Trainer>
  | BaseService<Client>
  | BaseService<EventType>
  | BaseService<VirtualGym>
  | BaseService<GymZone>;

type CommonUpdateByDTOs =
  | TrainerDTO<Gym | number>
  | ClientDTO<Gym | number>
  | EventTypeDTO
  | VirtualGymDTO
  | GymZoneDTO;

type CommonUpdateByEntities =
  | 'Trainer'
  | 'Client'
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone';

type CommonUpdateByValues =
  | '["client", "owner", "worker"]'
  | '["owner", "worker"]';

type WorkerUpdatePermissions =
  | 'updateClients'
  | 'updateEventTypes'
  | 'updateEvents'
  | 'updateGymZones'
  | 'updateTrainers'
  | 'updateVirtualGyms';

type UpdateByOwnerOrWorkerProps = {
  service: CommonUpdateByServices;
  ownerService: BaseService<Owner>;
  workerService: BaseService<Worker>;
  controller: BaseController;
  token: ParsedToken;
  res: Response;
  by: 'worker' | 'owner';
  dto: CommonUpdateByDTOs;
  entityName: CommonUpdateByEntities;
  updatableBy: CommonUpdateByValues;
  countArgs: any;
  workerUpdatePermission?: WorkerUpdatePermissions;
};

export const updatedByOwnerOrWorker = async ({
  service,
  ownerService,
  workerService,
  controller,
  res,
  token,
  by,
  dto,
  entityName,
  updatableBy,
  countArgs,
  workerUpdatePermission
}: UpdateByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (by === 'worker') {
    if (!workerUpdatePermission) {
      log.error(
        `Controller[${controller.constructor.name}]`,
        '"update" handler',
        'No "workerCreatePermission passed'
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
        `Worker does not exist. Can not update the ${entityName.toLowerCase()}.`
      );
    } else if (!worker[workerUpdatePermission]) {
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
        `Owner does not exist. Can not update the ${entityName.toLowerCase()}.`
      );
    }
  } else {
    return controller.unauthorized(
      res,
      `Ensure to pass the [by] parameter. Valid values are ${updatableBy}.`
    );
  }

  // Search for the entity
  return findAndUpdateEntity({
    controller,
    service,
    res,
    dto,
    countArgs,
    entityName
  });
};

/* ENTITY SPECIFIC UPDATERS */

type OwnerUpdateProps = {
  service: BaseService<Owner>;
  controller: BaseController;
  req: Request;
  res: Response;
};

export const ownerUpdate = async ({
  service,
  controller,
  req,
  res
}: OwnerUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await OwnerDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    if (dto.id !== token.id) {
      return controller.unauthorized(res);
    }

    findAndUpdateEntity({
      controller,
      service,
      res,
      dto,
      entityName: 'Owner',
      countArgs: { person: { id: dto.id } }
    });
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

type WorkerUpdateProps = {
  service: BaseService<Worker>;
  ownerService: BaseService<Owner>;
  controller: BaseController;
  req: Request;
  res: Response;
  by: 'owner' | 'worker';
};

export const workerUpdate = async ({
  service,
  ownerService,
  controller,
  req,
  res,
  by
}: WorkerUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await WorkerDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    if (by === 'worker') {
      if (dto.id !== token.id) {
        return controller.unauthorized(res);
      }
    } else if (by === 'owner') {
      const count = await ownerService.count({ person: { id: token.id } });

      if (!count) {
        return controller.unauthorized(
          res,
          'Owner does not exist. Can not update the worker.'
        );
      }
    } else {
      return controller.unauthorized(
        res,
        'Ensure to pass the [by] parameter. Valid values are ["owner", "worker"].'
      );
    }

    return findAndUpdateEntity({
      controller,
      service,
      res,
      dto,
      entityName: 'Worker',
      countArgs: { person: { id: dto.id } }
    });
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

type TrainerUpdateProps = {
  service: BaseService<Trainer>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  controller: BaseController;
  req: Request;
  res: Response;
  by: 'worker' | 'owner';
};

export const trainerUpdate = async ({
  service,
  ownerService,
  workerService,
  controller,
  req,
  res,
  by
}: TrainerUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await TrainerDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    return updatedByOwnerOrWorker({
      service,
      ownerService,
      workerService,
      controller,
      res,
      token,
      dto,
      by,
      entityName: 'Trainer',
      updatableBy: '["owner", "worker"]',
      workerUpdatePermission: 'updateTrainers',
      countArgs: { person: { id: dto.id } }
    });
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};

type CliendUpdateProps = {
  service: BaseService<Client>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  controller: BaseController;
  req: Request;
  res: Response;
  by: 'client' | 'worker' | 'owner';
};

export const clientUpdate = async ({
  controller,
  service,
  ownerService,
  workerService,
  req,
  res,
  by
}: CliendUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await ClientDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    if (by === 'client') {
      if (dto.id !== token.id) {
        return controller.unauthorized(res);
      }

      return findAndUpdateEntity({
        controller,
        service,
        res,
        dto,
        countArgs: { person: { id: dto.id } },
        entityName: 'Client'
      });
    } else {
      return updatedByOwnerOrWorker({
        service,
        ownerService,
        workerService,
        controller,
        res,
        token,
        dto,
        by,
        entityName: 'Client',
        updatableBy: '["client", "owner", "worker"]',
        workerUpdatePermission: 'updateClients',
        countArgs: { person: { id: dto.id } }
      });
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};
