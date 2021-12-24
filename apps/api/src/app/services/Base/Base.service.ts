import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

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

  public createQueryBuilder({
    alias,
    queryRunner
  }: CreateQueryBuilderProps): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner);
  }
}
