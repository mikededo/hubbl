import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DTOGroups, EventTypeDTO } from '@hubbl/shared/models/dto';

import { EventTypeService, OwnerService, WorkerService } from '../../services';
import BaseController, { UpdateByOwnerWorkerController } from '../Base';
import { createdByOwnerOrWorker } from '../helpers';

class IEventTypeCreateController extends BaseController {
  protected service: EventTypeService = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new EventTypeService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    const { token } = res.locals;

    try {
      return createdByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        fromClass: EventTypeDTO.fromClass,
        token,
        by: req.query.by as any,
        dto: await EventTypeDTO.fromJson(req.body, DTOGroups.CREATE),
        entityName: 'EventType',
        workerCreatePermission: 'createEventTypes'
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}

const createInstance = new IEventTypeCreateController();

export const EventTypeCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  EventTypeService,
  EventTypeDTO.fromJson,
  'EventType',
  'updateEventTypes'
);

export const EventTypeUpdateController = updateInstance;
