import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import {
  DTOGroups,
  EventTemplateDTO,
  EventTypeDTO,
  GymZoneDTO
} from '@hubbl/shared/models/dto';
import {
  EventTemplate,
  EventType,
  GymZone
} from '@hubbl/shared/models/entities';

import {
  EventTemplateService,
  EventTypeService,
  GymZoneService,
  OwnerService,
  RepositoryAccessor,
  WorkerService
} from '../../services';
import {
  BaseFromClassCallable,
  BaseFromJsonCallable,
  createdByOwnerOrWorker
} from '../helpers';
import BaseController from './Base.controller';

type CreatableEntityNames = 'EventTemplate' | 'EventType' | 'GymZone';

type WorkerCreatePermissions =
  | 'createEventTemplates'
  | 'createEventTypes'
  | 'createGymZones';

type CreatableEntities = EventTemplate | EventType | GymZone;

type CreatableFromJson =
  | BaseFromJsonCallable<EventTemplateDTO>
  | BaseFromJsonCallable<EventTypeDTO>
  | BaseFromJsonCallable<GymZoneDTO>;

type CreatableFromClass =
  | BaseFromClassCallable<EventTemplate, EventTemplateDTO>
  | BaseFromClassCallable<EventType, EventTypeDTO>
  | BaseFromClassCallable<GymZone, GymZoneDTO>;

type CreatableServices =
  | EventTemplateService
  | EventTypeService
  | GymZoneService;

export default class CreateByOwnerWorkerController extends BaseController {
  protected service: CreatableServices = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  constructor(
    private serviceCtr: new (
      accessor: RepositoryAccessor<CreatableEntities>
    ) => CreatableServices,
    private fromJson: CreatableFromJson,
    private fromClass: CreatableFromClass,
    private entityName: CreatableEntityNames,
    private workerCreatePermission: WorkerCreatePermissions
  ) {
    super();
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new this.serviceCtr(getRepository);
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
        fromClass: this.fromClass,
        token,
        dto: await this.fromJson(req.body, DTOGroups.CREATE),
        entityName: this.entityName,
        workerCreatePermission: this.workerCreatePermission
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}
