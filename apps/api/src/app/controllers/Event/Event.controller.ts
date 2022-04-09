import { Request, Response } from 'express';
import * as log from 'npmlog';

import { DTOGroups, EventDTO } from '@hubbl/shared/models/dto';
import { Event } from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';

import { getRepository } from '../../../config';
import {
  EventService,
  EventTemplateService,
  GymZoneService,
  OwnerService,
  WorkerService
} from '../../services';
import BaseController, { DeleteByOwnerWorkerController } from '../Base';
import { createdByOwnerOrWorker, updatedByOwnerOrWorker } from '../helpers';

class IEventCreateController extends BaseController {
  protected service: EventService = undefined;
  protected templateService: EventTemplateService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;
  protected gymZoneService: GymZoneService = undefined;

  private async fromTemplate(
    res: Response,
    json: any
  ): Promise<Event | Response> {
    try {
      let template = { ...json };

      // If any template is given
      if (json.template) {
        // Find the template, and override the json data
        template = await this.templateService.findOne({
          where: { id: json.template },
          loadEagerRelations: false,
          loadRelationIds: true
        });

        if (!template) {
          return this.forbidden(res, 'Event template does not exist.');
        }
      }

      // Copy the template props to a new DTO
      const result = new Event();
      result.name = json.name;
      result.description = json.description;
      result.capacity = template.capacity;
      result.covidPassport = template.covidPassport;
      result.maskRequired = template.maskRequired;
      result.difficulty = template.difficulty;
      result.color = json.color;
      result.startTime = json.startTime;
      result.endTime = json.endTime;
      result.date = json.date;
      result.gym = template.gym;
      result.trainer = json.trainer;
      result.calendar = json.calendar;

      return result;
    } catch (e) {
      return this.onFail(res, e, 'create');
    }
  }

  private async gymZoneClassType(dto: EventDTO) {
    return await this.gymZoneService
      .createQueryBuilder({ alias: 'gz' })
      .select('gz.isClassType')
      .where('gz.calendar = :calendar', { calendar: dto.calendar })
      .getOne();
  }

  private async trainerOverlaps(dto: EventDTO): Promise<number> {
    return await this.service
      .createQueryBuilder({ alias: 'e' })
      .where('e.startTime < :endTime', { endTime: dto.endTime })
      .andWhere('e.endTime > :startTime', { startTime: dto.startTime })
      .andWhere('e.date.year = :year', { year: dto.date.year })
      .andWhere('e.date.month = :month', { month: dto.date.month })
      .andWhere('e.date.day = :day', { day: dto.date.day })
      .andWhere('e.trainer.person.id = :trainer', { trainer: dto.trainer })
      .getCount();
  }

  private overlapsEvents(dto: EventDTO): Promise<number> {
    // Check if there's any event that overlaps
    return this.service
      .createQueryBuilder({ alias: 'e' })
      .where('e.startTime < :endTime', { endTime: dto.endTime })
      .andWhere('e.endTime > :startTime', { startTime: dto.startTime })
      .andWhere('e.date.year = :year', { year: dto.date.year })
      .andWhere('e.date.month = :month', { month: dto.date.month })
      .andWhere('e.date.day = :day', { day: dto.date.day })
      .andWhere('e.calendar = :calendar', { calendar: dto.calendar })
      .getCount();
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventService(getRepository);
    }

    if (!this.templateService) {
      this.templateService = new EventTemplateService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService(getRepository);
    }

    const maybeEvent = await this.fromTemplate(res, req.body);
    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    let dto: EventDTO;
    try {
      dto = await EventDTO.fromJson(maybeEvent, DTOGroups.CREATE);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Check the times
    if (dto.startTime >= dto.endTime) {
      return this.clientError(res, 'Start and end time values are not valid');
    }

    // Ensure event is being created in a calendar which belongs
    // to a class type gym zone
    try {
      const maybeCalendar = await this.gymZoneClassType(dto);
      if (!maybeCalendar) {
        return this.forbidden(res, 'Gym zone does not exist.');
      } else if (!maybeCalendar.isClassType) {
        return this.forbidden(
          res,
          'Cannot create an Event to a non class GymZone.'
        );
      }
    } catch (e) {
      return this.onFail(res, e, 'create');
    }

    try {
      const overlaps = await this.trainerOverlaps(dto);
      if (overlaps) {
        return this.forbidden(
          res,
          'Trainer has already an event that overlaps with the given date and timestamps.'
        );
      }
    } catch (e) {
      return this.onFail(res, e, 'create');
    }

    try {
      const overlappedEvents = await this.overlapsEvents(dto);
      if (overlappedEvents) {
        return this.clientError(
          res,
          `[${dto.date.year}/${dto.date.month}/${dto.date.day} ${dto.startTime}-${dto.endTime}] overlaps with ${overlappedEvents} events`
        );
      }
    } catch (e) {
      return this.onFail(res, e, 'create');
    }

    return createdByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: EventDTO.fromClass,
      token: res.locals.token as ParsedToken,
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
      dto = await EventDTO.fromJson(req.body, DTOGroups.UPDATE);
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
      log.error(
        `Controller [${this.constructor.name}]`,
        '"update" handler',
        e.toString()
      );

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
      dto,
      entityName: 'Event',
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
