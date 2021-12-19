import { EntityTarget, Repository } from 'typeorm';

/**
 * Defines the type that a service should recieve in its constructor
 */
export type RepositoryAccessor<T> = (
  entityClass: EntityTarget<T>,
  connectionName?: string
) => Repository<T>;
