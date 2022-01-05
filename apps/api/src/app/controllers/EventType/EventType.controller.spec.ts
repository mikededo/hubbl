import { EventTypeDTO } from '@hubbl/shared/models/dto';

import { EventTypeService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import {
  EventTypeCreateController,
  EventTypeDeleteController,
  EventTypeUpdateController
} from './EventType.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('EventType controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EventTypeCreateController', () => {
    it('should create an CreateByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeCreateController).toBeInstanceOf(
        CreateByOwnerWorkerController
      );
      expect(EventTypeCreateController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeCreateController['fromJson']).toBe(EventTypeDTO.fromJson);
      expect(EventTypeCreateController['fromClass']).toBe(
        EventTypeDTO.fromClass
      );
      expect(EventTypeCreateController['entityName']).toBe('EventType');
      expect(EventTypeCreateController['workerCreatePermission']).toBe(
        'createEventTypes'
      );
    });
  });

  describe('EventTypeUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(EventTypeUpdateController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeUpdateController['fromJson']).toBe(EventTypeDTO.fromJson);
      expect(EventTypeUpdateController['entityName']).toBe('EventType');
      expect(EventTypeUpdateController['workerUpdatePermission']).toBe(
        'updateEventTypes'
      );
    });
  });

  describe('EventTypeDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(EventTypeDeleteController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeDeleteController['entityName']).toBe('EventType');
      expect(EventTypeDeleteController['workerDeletePermission']).toBe(
        'deleteEventTypes'
      );
    });
  });
});
