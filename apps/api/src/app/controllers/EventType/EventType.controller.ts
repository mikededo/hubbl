import { EventTypeDTO } from '@hubbl/shared/models/dto';

import { EventTypeService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';

const createInstance = new CreateByOwnerWorkerController(
  EventTypeService,
  EventTypeDTO.fromJson,
  EventTypeDTO.fromClass,
  'EventType',
  'createEventTypes'
);

export const EventTypeCreateController = createInstance;

const updateInstance = new UpdateByOwnerWorkerController(
  EventTypeService,
  EventTypeDTO.fromJson,
  'EventType',
  'updateEventTypes'
);

export const EventTypeUpdateController = updateInstance;

const deleteInstance = new DeleteByOwnerWorkerController(
  EventTypeService,
  'EventType',
  'deleteEventTypes'
);

export const EventTypeDeleteController = deleteInstance;
