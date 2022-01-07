import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DTOGroups, EventDTO } from '@hubbl/shared/models/dto';

import { EventService, OwnerService, WorkerService } from '../../services';
import BaseController, { DeleteByOwnerWorkerController } from '../Base';
import {
  createdByOwnerOrWorker,
  ParsedToken,
  updatedByOwnerOrWorker
} from '../helpers';

class IEventCreateController extends BaseController {
  protected service: EventService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    let dto: EventDTO;

    try {
      dto = await EventDTO.fromJson(req.body, DTOGroups.CREATE);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Check the times
    if (dto.startTime >= dto.endTime) {
      return this.clientError(res, 'Start and end time values are not valid');
    }

    try {
      // Check if there's any event that overlaps
      const overlappedEvents = await this.service
        .createQueryBuilder({ alias: 'e' })
        .where('e.startTime < :endTime', { endTime: dto.endTime })
        .andWhere('e.endTime > :startTime', { startTime: dto.startTime })
        .andWhere('e.date.year = :year', { year: dto.date.year })
        .andWhere('e.date.month = :month', { month: dto.date.month })
        .andWhere('e.date.day = :day', { day: dto.date.day })
        .andWhere('e.calendar = :calendar', { calendar: dto.calendar })
        .getCount();

      if (overlappedEvents) {
        return this.clientError(
          res,
          `[${dto.date.year}/${dto.date.month}/${dto.date.day} ${dto.startTime}-${dto.endTime}] overlaps with ${overlappedEvents} events`
        );
      }
    } catch (e) {
      return this.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }

    return createdByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: EventDTO.fromClass,
      token: res.locals.token as ParsedToken,
      by: req.query.by as any,
      dto,
      entityName: 'Event',
      workerCreatePermission: 'createEvents'
    });
  }
}

const createInstance = new IEventCreateController();

export const EventCreateController = createInstance;

class IEventUpdateController extends BaseController {
  protected service: EventService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    let dto: EventDTO;

    try {
      dto = await EventDTO.fromJson(req.body, DTOGroups.CREATE);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Check the times
    if (dto.startTime >= dto.endTime) {
      return this.clientError(res, 'Start and end time values are not valid');
    }

    try {
      // Check if there's any event that overlaps
      const overlappedEvents = await this.service
        .createQueryBuilder({ alias: 'e' })
        .where('e.startTime < :endTime', { endTime: dto.endTime })
        .andWhere('e.endTime > :startTime', { startTime: dto.startTime })
        .andWhere('e.date.year = :year', { year: dto.date.year })
        .andWhere('e.date.month = :month', { month: dto.date.month })
        .andWhere('e.date.day = :day', { day: dto.date.day })
        .andWhere('e.id != :id', { id: dto.id })
        .andWhere('e.calendar = :calendar', { calendar: dto.calendar })
        .getCount();

      if (overlappedEvents) {
        return this.clientError(
          res,
          `[${dto.date.year}/${dto.date.month}/${dto.date.day} ${dto.startTime}-${dto.endTime}] overlaps with ${overlappedEvents} events`
        );
      }
    } catch (e) {
      return this.fail(
        res,
        'Internal server error. If the problem persists, contact our team.'
      );
    }

    return updatedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token: res.locals.token as ParsedToken,
      by: req.query.by as any,
      dto,
      entityName: 'Event',
      updatableBy: '["owner", "worker"]',
      countArgs: { id: dto.id },
      workerUpdatePermission: 'updateEvents'
    });
  }
}

const updateInstance = new IEventUpdateController();

export const EventUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  EventService,
  'Event',
  'deleteEvents'
);

export const EventDeleteController = deleteInstance;
