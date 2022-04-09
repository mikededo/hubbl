import { Event } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class EventService extends BaseService<Event> {
  constructor() {
    super(Event);
  }
}
