import { Request, Response } from 'express';

import {
  EventService,
  EventTemplateService,
  EventTypeService,
  GymZoneService,
  OwnerService,
  WorkerService
} from '../../services';
import { deletedByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type DeletableEntityNames = 'Event' | 'EventTemplate' | 'EventType' | 'GymZone';

type WorkerDeletePermissions =
  | 'deleteEvents'
  | 'deleteEventTemplates'
  | 'deleteEventTypes'
  | 'deleteGymZones';

type DeletableServices =
  | EventService
  | EventTemplateService
  | EventTypeService
  | GymZoneService;

export default class DeleteByOwnerWorkerController extends BaseController {
  protected service: DeletableServices = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  constructor(
    private serviceCtr: new () => DeletableServices,
    private entityName: DeletableEntityNames,
    private workerDeletePermission: WorkerDeletePermissions
  ) {
    super();
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new this.serviceCtr();
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService();
    }

    if (!this.workerService) {
      this.workerService = new WorkerService();
    }

    const { token } = res.locals;

    return deletedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token,
      entityId: req.params.id,
      entityName: this.entityName,
      countArgs: { id: req.params.id },
      workerDeletePermission: this.workerDeletePermission
    });
  }
}
