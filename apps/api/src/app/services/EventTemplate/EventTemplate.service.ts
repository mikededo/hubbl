import { EventTemplate } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class EventTemplateService extends BaseService<EventTemplate> {
  constructor() {
    super(EventTemplate);
  }
}
