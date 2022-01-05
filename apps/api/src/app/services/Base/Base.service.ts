import {
  FindCondition,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm';

import { RepositoryAccessor } from '../util';

type CreateQueryBuilderProps = {
  alias?: string;
  queryRunner?: QueryRunner;
};

export default class BaseService<T> {
  protected repository: Repository<T>;

  constructor(type: new () => T, accessor: RepositoryAccessor<T>) {
    this.repository = accessor(type, 'postgres');
  }

  public save(value: T): Promise<T> {
    return this.repository.save(value);
  }

  public find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  public findOne(id: number, options?: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(id, options);
  }

  public update(id: number, value: T): Promise<UpdateResult> {
    return this.repository.update(id, value);
  }

  public softDelete(criteria: number | string): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }

  public count(args: FindManyOptions<T> | FindCondition<T>): Promise<number> {
    return this.repository.count(args);
  }

  public createQueryBuilder({
    alias,
    queryRunner
  }: CreateQueryBuilderProps): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
}
