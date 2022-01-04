import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import {
  DTOGroups,
  EventTypeDTO,
  GymZoneDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import { EventType, GymZone, VirtualGym } from '@hubbl/shared/models/entities';

import {
  EventTypeService,
  GymZoneService,
  OwnerService,
  RepositoryAccessor,
  VirtualGymService,
  WorkerService
} from '../../services';
import { BaseFromJsonCallable, updatedByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type UpdatableEntityNames = 'EventType' | 'VirtualGym' | 'GymZone';

type WorkerUpdatePermissions =
  | 'updateEventTypes'
  | 'updateEvents'
  | 'updateGymZones'
  | 'updateTrainers'
  | 'updateVirtualGyms';

type UpdatableEntities = EventType | GymZone | VirtualGym;

type UpdatableFromJson =
  | BaseFromJsonCallable<EventTypeDTO>
  | BaseFromJsonCallable<GymZoneDTO>
  | BaseFromJsonCallable<VirtualGymDTO>;

type UpdatableServices = EventTypeService | GymZoneService | VirtualGymService;

export class UpdateByOwnerWorkerController extends BaseController {
  protected service: UpdatableServices = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  constructor(
    private serviceCtr: new (
      accessor: RepositoryAccessor<UpdatableEntities>
    ) => UpdatableServices,
    private fromJson: UpdatableFromJson,
    private entityName: UpdatableEntityNames,
    private workerUpdatePermission: WorkerUpdatePermissions
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
      const dto = await this.fromJson(req.body, DTOGroups.UPDATE);

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: this.workerService,
        controller: this,
        res,
        token,
        by: req.query.by as any,
        dto,
        entityName: this.entityName,
        updatableBy: '["owner", "worker"]',
        countArgs: { id: dto.id },
        workerUpdatePermission: this.workerUpdatePermission
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}
