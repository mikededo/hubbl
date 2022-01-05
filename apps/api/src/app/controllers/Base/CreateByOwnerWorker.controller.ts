import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { EventTypeDTO, GymZoneDTO } from '@hubbl/shared/models/dto';
import { EventType, GymZone } from '@hubbl/shared/models/entities';
import {
  BaseFromClassCallable,
  BaseFromJsonCallable,
  DTOGroups
} from '@hubbl/shared/types';

import {
  EventTypeService,
  GymZoneService,
  OwnerService,
  RepositoryAccessor,
  WorkerService
} from '../../services';
import { createdByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type CreatableEntityNames = 'EventType' | 'GymZone';

type WorkerCreatePermissions = 'createEventTypes' | 'createGymZones';

type CreatableEntities = EventType | GymZone;

type CreatableFromJson =
  | BaseFromJsonCallable<EventTypeDTO>
  | BaseFromJsonCallable<GymZoneDTO>;

type CreatableFromClass =
  | BaseFromClassCallable<EventType, EventTypeDTO>
  | BaseFromClassCallable<GymZone, GymZoneDTO>;

type CreatableServices = EventTypeService | GymZoneService;

export default class IEventTypeCreateController extends BaseController {
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
        by: req.query.by as any,
        dto: await this.fromJson(req.body, DTOGroups.CREATE),
        entityName: this.entityName,
        workerCreatePermission: this.workerCreatePermission
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}
