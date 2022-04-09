import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm';

import { Source } from '../../../config';

type CreateQueryBuilderProps = {
  alias?: string;
  queryRunner?: QueryRunner;
};

export default class BaseService<T> {
  protected repository: Repository<T>;

  constructor(type: new () => T) {
    this.repository = (
      process.env.NODE_ENV === 'test' ? Source : Source
    ).manager.getRepository(type);
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

  public findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  public findOneBy(options: FindOptionsWhere<T>): Promise<T> {
    return this.repository.findOneBy(options);
  }

  public update(id: number, value: T): Promise<UpdateResult> {
    return this.repository.update(id, value);
  }

  public delete(criteria: number | string): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  public count(args: FindManyOptions<T>): Promise<number> {
    return this.repository.count(args);
  }

  public createQueryBuilder({
    alias,
    queryRunner
  }: CreateQueryBuilderProps): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
}
