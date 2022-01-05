import { EventTemplate } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class EventTemplateService extends BaseService<EventTemplate> {
  constructor(repoAccessor: RepositoryAccessor<EventTemplate>) {
    super(EventTemplate, repoAccessor);
  }
}
