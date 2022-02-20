import {
  DeepPartial,
  DeleteResult,
  FindCondition,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm';

import { RepositoryAccessor } from '../util';

type FindOneProps<T> = {
  id?: number;
  options?: FindOneOptions<T>;
};

type CreateQueryBuilderProps = {
  alias?: string;
  queryRunner?: QueryRunner;
};

export default class BaseService<T> {
  protected repository: Repository<T>;

  constructor(type: new () => T, accessor: RepositoryAccessor<T>) {
    this.repository = accessor(
      type,
      process.env.NODE_ENV === 'test' ? 'postgres-test' : 'postgres'
    );
  }

  public get manager() {
    return this.repository.manager;
  }

  public save(value: DeepPartial<T>): Promise<T> {
    return this.repository.save(value);
  }

  public find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  public findOne({ id, options }: FindOneProps<T>): Promise<T> {
    return id
      ? this.repository.findOne(id, options)
      : this.repository.findOne(options);
  }

  public update(id: number, value: T): Promise<UpdateResult> {
    return this.repository.update(id, value);
  }

  public delete(criteria: number | string): Promise<DeleteResult> {
    return this.repository.delete(criteria);
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
