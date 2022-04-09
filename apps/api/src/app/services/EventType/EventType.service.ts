import { EventType } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class EventTypeService extends BaseService<EventType> {
  constructor() {
    super(EventType);
  }
}
