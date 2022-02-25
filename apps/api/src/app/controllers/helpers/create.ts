import { Response } from 'express';
import * as log from 'npmlog';

import {
  CalendarAppointmentDTO,
  EventAppointmentDTO,
  EventDTO,
  EventTemplateDTO,
  EventTypeDTO,
  GymZoneDTO,
  TrainerDTO,
  TrainerTagDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import {
  CalendarAppointment,
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
import { BaseFromClassCallable } from './types';

type CommonCreateByServices = BaseService<
  | CalendarAppointment
  | EventAppointment
  | Event
  | EventTemplate
  | EventType
  | VirtualGym
  | GymZone
  | Trainer
  | TrainerTag
>;

type CommonCreateByDTOs =
  | CalendarAppointmentDTO
  | EventAppointmentDTO
  | EventDTO
  | EventTemplateDTO
  | EventTypeDTO
  | VirtualGymDTO
  | GymZoneDTO
  | TrainerDTO<Gym | number>
  | TrainerTagDTO;

type CommonCreateByEntities =
  | 'CalendarAppointment'
  | 'EventAppointment'
  | 'Event'
  | 'EventTemplate'
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone'
  | 'Trainer'
  | 'TrainerTag';

type WorkerCreatePermissions =
  | 'createCalendarAppointments'
  | 'createEventAppointments'
  | 'createEvents'
  | 'createClients'
  | 'createEventTemplates'
  | 'createEventTypes'
  | 'createEvents'
  | 'createGymZones'
  | 'createTrainers'
  | 'createTags';

type FromClassCallables =
  | BaseFromClassCallable<CalendarAppointment, CalendarAppointmentDTO>
  | BaseFromClassCallable<EventAppointment, EventAppointmentDTO>
  | BaseFromClassCallable<Event, EventDTO>
  | BaseFromClassCallable<EventTemplate, EventTemplateDTO>
  | BaseFromClassCallable<EventType, EventTypeDTO>
  | BaseFromClassCallable<VirtualGym, VirtualGymDTO>
  | BaseFromClassCallable<GymZone, GymZoneDTO>
  | BaseFromClassCallable<TrainerTag, TrainerTagDTO>;

type CreatedByOwnerOrWorkerProps = {
  service: CommonCreateByServices;
  ownerService: BaseService<Owner>;
  workerService: BaseService<Worker>;
  controller: BaseController;
  res: Response;
  fromClass: FromClassCallables;
  token: ParsedToken;
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
  dto,
  entityName,
  workerCreatePermission
}: CreatedByOwnerOrWorkerProps): Promise<Response> => {
  // Validate who is updating
  if (token.user === 'worker') {
    if (!workerCreatePermission) {
      log.error(
        `Controller [${controller.constructor.name}]`,
        '"fetch" handler',
        'No "workerCreatePermission" passed'
      );

      return controller.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }

    const worker = await workerService.findOne({ id: token.id });

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
  } else if (token.user === 'owner') {
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
      'Client can not perform such operation.'
    );
  }

  try {
    // If valid, update the entity
    const result = await service.save(await dto.toClass());

    // Return ok
    return controller.created(res, fromClass(result as any));
  } catch (_) {
    log.error(
      `Controller [${controller.constructor.name}]`,
      '"create" handler',
      _.toString()
    );

    return controller.fail(
      res,
      'Internal server error. If the problem persists, contact our team.'
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
    entityName
  });
