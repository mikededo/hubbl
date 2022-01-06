import { Event } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class EventService extends BaseService<Event> {
  constructor(repoAccessor: RepositoryAccessor<Event>) {
    super(Event, repoAccessor);
  }
}
