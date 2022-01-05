import { EventType } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class EventTypeService extends BaseService<EventType> {
  constructor(repoAccessor: RepositoryAccessor<EventType>) {
    super(EventType, repoAccessor);
  }
}
