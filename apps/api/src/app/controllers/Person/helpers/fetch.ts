import camelcaseKeys = require('camelcase-keys');
import { Response } from 'express';

import { OwnerDTO, TrainerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Gym, Owner, Trainer, Worker } from '@hubbl/shared/models/entities';

import { OwnerService, TrainerService, WorkerService } from '../../../services';
import BaseController from '../../Base';
import { BaseFromClassCallable } from '../../helpers';

type FetchFromClass =
  | BaseFromClassCallable<Owner, OwnerDTO<Gym | number>>
  | BaseFromClassCallable<Worker, WorkerDTO<Gym | number>>
  | BaseFromClassCallable<Trainer, TrainerDTO<Gym | number>>;

type FetchProps = {
  service: OwnerService | WorkerService | TrainerService;
  controller: BaseController;
  res: Response;
  fromClass: FetchFromClass;
  alias: string;
  personFk: string;
  gymId: number;
  skip: number;
};

const parseFk = (key: string): string =>
  /_fk$/.test(key) ? key.split(/_fk$/)[0] : key;

export const fetch = async ({
  service,
  controller,
  res,
  fromClass,
  alias,
  personFk,
  gymId,
  skip
}: FetchProps) => {
  /**
   * Due to a typeorm limitation, the leftJoinAndSelect skips the person
   * from the Worker and it has to be obtained using the getRawMany, in
   * order to parse them afterwards
   */
  const result = await service
    .createQueryBuilder({ alias })
    .leftJoinAndSelect('person', 'p')
    .where('p.gym = :gymId', { gymId })
    .andWhere(`${alias}.${personFk} = p.id`)
    .skip(skip)
    .limit(25)
    .getRawMany();

  return controller.ok(
    res,
    result.map((e) => {
      const parsed = { person: {} };
      
      Object.entries(e).forEach(([k, v]) => {
        if (new RegExp(`^${alias}_`).test(k)) {
          const [, prop] = k.split(new RegExp(`^${alias}_`));
          parsed[parseFk(prop)] = v;
        } else if (/^p_/.test(k)) {
          const [, prop] = k.split(/^p_/);
          parsed.person[parseFk(prop)] = v;
        }
      });

      return fromClass(camelcaseKeys(parsed, { deep: true }) as any);
    })
  );
};
