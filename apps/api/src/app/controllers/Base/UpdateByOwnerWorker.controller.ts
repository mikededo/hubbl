import { Request, Response } from 'express';

import {
  DTOGroups,
  EventDTO,
  EventTemplateDTO,
  EventTypeDTO,
  GymZoneDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';

import {
  EventService,
  EventTemplateService,
  EventTypeService,
  GymZoneService,
  OwnerService,
  VirtualGymService,
  WorkerService
} from '../../services';
import { BaseFromJsonCallable, updatedByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type UpdatableEntityNames =
  | 'Event'
  | 'EventTemplate'
  | 'EventType'
  | 'VirtualGym'
  | 'GymZone';

type WorkerUpdatePermissions =
  | 'updateEvents'
  | 'updateEventTemplates'
  | 'updateEventTypes'
  | 'updateGymZones'
  | 'updateVirtualGyms';

type UpdatableFromJson =
  | BaseFromJsonCallable<EventDTO>
  | BaseFromJsonCallable<EventTemplateDTO>
  | BaseFromJsonCallable<EventTypeDTO>
  | BaseFromJsonCallable<GymZoneDTO>
  | BaseFromJsonCallable<VirtualGymDTO>;

type UpdatableServices =
  | EventService
  | EventTemplateService
  | EventTypeService
  | GymZoneService
  | VirtualGymService;

export default class UpdateByOwnerWorkerController extends BaseController {
  protected service: UpdatableServices = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  constructor(
    private serviceCtr: new () => UpdatableServices,
    private fromJson: UpdatableFromJson,
    private entityName: UpdatableEntityNames,
    private workerUpdatePermission: WorkerUpdatePermissions
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

    try {
      const dto = await this.fromJson(req.body, DTOGroups.UPDATE);

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        token,
        dto,
        entityName: this.entityName,
        countArgs: { id: dto.id },
        workerUpdatePermission: this.workerUpdatePermission
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}
