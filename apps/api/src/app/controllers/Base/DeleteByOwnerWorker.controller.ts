import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { EventType, GymZone } from '@hubbl/shared/models/entities';

import {
  EventTypeService,
  GymZoneService,
  OwnerService,
  RepositoryAccessor,
  WorkerService
} from '../../services';
import { deletedByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type DeletableEntityNames = 'EventType' | 'GymZone';

type WorkerDeletePermissions = 'deleteEventTypes' | 'deleteGymZones';

type DeletableEntities = EventType | GymZone;

type DeletableServices = EventTypeService | GymZoneService;

export default class DeleteByOwnerWorkerController extends BaseController {
  protected service: DeletableServices = undefined;
  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;

  constructor(
    private serviceCtr: new (
      accessor: RepositoryAccessor<DeletableEntities>
    ) => DeletableServices,
    private entityName: DeletableEntityNames,
    private workerDeletePermission: WorkerDeletePermissions
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

    return deletedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token,
      by: req.query.by as any,
      entityId: req.params.id,
      entityName: this.entityName,
      countArgs: { id: req.params.id },
      workerDeletePermission: this.workerDeletePermission
    });
  }
}
