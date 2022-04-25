import { Request, Response } from 'express';
import * as log from 'npmlog';

import {
  CalendarAppointmentDTO,
  ClientDTO,
  DTO,
  DTOGroups,
  EventAppointmentDTO,
  EventDTO,
  EventTemplateDTO,
  EventTypeDTO,
  GymDTO,
  GymZoneDTO,
  OwnerDTO,
  TrainerDTO,
  TrainerTagDTO,
  VirtualGymDTO,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import {
  CalendarAppointment,
  Client,
  Event,
  EventAppointment,
  EventTemplate,
  EventType,
  Gym,
  GymZone,
  Owner,
  Trainer,
  TrainerTag,
  VirtualGym,
  Worker
} from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';

import { BaseService } from '../../services';
import BaseController from '../Base';

/* COMMON UPDATERS */

type UpdatableServices = BaseService<
  | Owner
  | Worker
  | Trainer
  | CalendarAppointment
  | Client
  | Event
  | EventAppointment
  | EventTemplate
  | EventType
  | VirtualGym
  | Gym
  | GymZone
  | TrainerTag
>;

type UpdatableEntities =
  | 'Owner'
  | 'Worker'
  | 'Trainer'
  | 'CalendarAppointment'
  | 'Client'
  | 'Event'
  | 'EventAppointment'
  | 'EventTemplate'
  | 'EventType'
  | 'VirtualGym'
  | 'Gym'
  | 'GymZone'
  | 'TrainerTag';

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
    // Special case for person entities
    if (/person-email-idx/.test(_.toString())) {
      return controller.forbidden(res, 'Email is already in use!');
    }

    log.error(
      `Controller [${controller.constructor.name}]`,
      '"update" handler',
      _.toString()
    );

    return controller.fail(
      res,
      'Internal server error. If the problem persists, contact our team.'
    );
  }
};

type CommonUpdateByDTOs =
  | TrainerDTO<Gym | number>
  | ClientDTO<Gym | number>
  | EventDTO
  | CalendarAppointmentDTO
  | EventAppointmentDTO
  | EventTemplateDTO
  | EventTypeDTO
  | VirtualGymDTO
  | GymDTO
  | GymZoneDTO
  | TrainerTagDTO;

type CommonUpdateByEntities =
  | 'Trainer'
  | 'CalendarAppointment'
  | 'Client'
  | 'Event'
  | 'EventAppointment'
  | 'EventTemplate'
  | 'EventType'
  | 'VirtualGym'
  | 'Gym'
  | 'GymZone'
  | 'TrainerTag';

type WorkerUpdatePermissions =
  | 'updateCalendarAppointments'
  | 'updateClients'
  | 'updateEvents'
  | 'updateEventAppointments'
  | 'updateEventTemplates'
  | 'updateEventTypes'
  | 'updateGymZones'
  | 'updateTrainers'
  | 'updateVirtualGyms'
  | 'updateTags';

type UpdateByOwnerOrWorkerProps = {
  service: UpdatableServices;
  ownerService: BaseService<Owner>;
  workerService: BaseService<Worker>;
  controller: BaseController;
  token: ParsedToken;
  res: Response;
  dto: CommonUpdateByDTOs;
  entityName: CommonUpdateByEntities;
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
  dto,
  entityName,
  countArgs,
  workerUpdatePermission
}: UpdateByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (token.user === 'worker') {
    if (!workerUpdatePermission) {
      log.error(
        `Controller [${controller.constructor.name}]`,
        '"update" handler',
        'No "workerCreatePermission passed'
      );

      return controller.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }

    const worker = await workerService.findOneBy({ personId: token.id });

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
  } else if (token.user === 'owner') {
    const count = await ownerService.count({ where: { personId: token.id } });

    if (!count) {
      return controller.unauthorized(
        res,
        `Owner does not exist. Can not update the ${entityName.toLowerCase()}.`
      );
    }
  } else {
    return controller.unauthorized(
      res,
      'Client can not perform such operation.'
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
      countArgs: { where: { personId: dto.id } }
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
};

export const workerUpdate = async ({
  service,
  ownerService,
  controller,
  req,
  res
}: WorkerUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await WorkerDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    if (token.user === 'worker') {
      if (dto.id !== token.id) {
        return controller.unauthorized(res);
      }
    } else if (token.user === 'owner') {
      const count = await ownerService.count({ where: { personId: token.id } });

      if (!count) {
        return controller.unauthorized(
          res,
          'Owner does not exist. Can not update the worker.'
        );
      }
    } else {
      return controller.unauthorized(
        res,
        'Client can not perform such operation.'
      );
    }

    return findAndUpdateEntity({
      controller,
      service,
      res,
      dto,
      entityName: 'Worker',
      countArgs: { where: { personId: dto.id } }
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
};

export const trainerUpdate = async ({
  service,
  ownerService,
  workerService,
  controller,
  req,
  res
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
      entityName: 'Trainer',
      workerUpdatePermission: 'updateTrainers',
      countArgs: { where: { personId: dto.id } }
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
};

export const clientUpdate = async ({
  controller,
  service,
  ownerService,
  workerService,
  req,
  res
}: CliendUpdateProps): Promise<Response> => {
  try {
    // Get the entity and validate it
    const dto = await ClientDTO.fromJson(req.body, DTOGroups.UPDATE);

    const { token } = res.locals;

    // Validate who is updating
    if (token.user === 'client') {
      if (dto.id !== token.id) {
        return controller.unauthorized(res);
      }

      return findAndUpdateEntity({
        controller,
        service,
        res,
        dto,
        countArgs: { where: { personId: dto.id } },
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
        entityName: 'Client',
        workerUpdatePermission: 'updateClients',
        countArgs: { where: { personId: dto.id } }
      });
    }
  } catch (e) {
    return BaseController.jsonResponse(res, 400, e);
  }
};
