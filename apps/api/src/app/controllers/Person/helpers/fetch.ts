import { Response } from 'express';

import { ClientDTO, TrainerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Client, Gym, Trainer, Worker } from '@hubbl/shared/models/entities';

import {
  ClientService,
  TrainerService,
  WorkerService
} from '../../../services';
import BaseController from '../../Base';
import { BaseFromClassCallable } from '../../helpers';

type FetchFromClass =
  | BaseFromClassCallable<Worker, WorkerDTO<Gym | number>>
  | BaseFromClassCallable<Client, ClientDTO<Gym | number>>
  | BaseFromClassCallable<Trainer, TrainerDTO<Gym | number>>;

type FetchProps<T extends WorkerService | ClientService | TrainerService> = {
  service: T;
  controller: BaseController;
  res: Response;
  fromClass: FetchFromClass;
  alias: string;
  gymId: number;
  skip: number;
};

export const fetch = async <
  T extends WorkerService | ClientService | TrainerService
>({
  service,
  controller,
  res,
  fromClass,
  alias,
  gymId,
  skip
}: FetchProps<T>) => {
  const result = await service.find({
    join: { alias, innerJoin: { person: `${alias}.person` } },
    where: { person: { gym: gymId } },
    take: 15,
    skip
  });

  return controller.ok(
    res,
    result.map((e: Worker & Client & Trainer) => fromClass(e))
  );
};
