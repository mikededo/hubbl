import { Repository } from 'typeorm';
import { RepositoryAccessor } from '../util';

export default class BaseService<T> {
  protected repository: Repository<T>;

  constructor(type: new () => T, accessor: RepositoryAccessor<T>) {
    this.repository = accessor(type, 'postgres');
  }

  public save(value: T): Promise<T> {
    return this.repository.save(value);
  }
}
