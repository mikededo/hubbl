import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';

const createInstance = new CreateByOwnerWorkerController(
  EventTemplateService,
  EventTemplateDTO.fromJson,
  EventTemplateDTO.fromClass,
  'EventTemplate',
  'createEventTemplates'
);

export const EventTemplateCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  EventTemplateService,
  EventTemplateDTO.fromJson,
  'EventTemplate',
  'updateEventTemplates'
);

export const EventTemplateUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  EventTemplateService,
  'EventTemplate',
  'deleteEventTemplates'
);

export const EventTemplateDeleteController = deleteInstance;
