import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DTOGroups, GymDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { GymService, OwnerService, RepositoryAccessor } from '../../services';
import { BaseFromJsonCallable, updatedByOwnerOrWorker } from '../helpers';
import BaseController from './Base.controller';

type UpdatableEntityNames = 'Gym';

type UpdatableEntities = Gym;

type UpdatableFromJson = BaseFromJsonCallable<GymDTO>;

type UpdatableServices = GymService;

export default class UpdateByOwnerWorkerController extends BaseController {
  protected service: UpdatableServices = undefined;
  protected ownerService: OwnerService = undefined;

  constructor(
    private serviceCtr: new (
      accessor: RepositoryAccessor<UpdatableEntities>
    ) => UpdatableServices,
    private fromJson: UpdatableFromJson,
    private entityName: UpdatableEntityNames
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

    const { token } = res.locals;

    try {
      const dto = await this.fromJson(req.body, DTOGroups.UPDATE);

      return updatedByOwnerOrWorker({
        service: this.service,
        ownerService: this.ownerService,
        workerService: undefined,
        controller: this,
        res,
        token,
        dto,
        entityName: this.entityName,
        countArgs: { id: dto.id },
        workerUpdatePermission: undefined
      });
    } catch (e) {
      return this.clientError(res, e);
    }
  }
}
