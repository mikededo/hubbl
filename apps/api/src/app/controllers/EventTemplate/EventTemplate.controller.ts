import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService } from '../../services';
import { CreateByOwnerWorkerController } from '../Base';

const createInstance = new CreateByOwnerWorkerController(
  EventTemplateService,
  EventTemplateDTO.fromJson,
  EventTemplateDTO.fromClass,
  'EventTemplate',
  'createEventTemplates'
);

export const EventTemplateCreateController = createInstance;
