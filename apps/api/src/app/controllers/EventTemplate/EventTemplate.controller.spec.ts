import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import {
  EventTemplateCreateController,
  EventTemplateDeleteController,
  EventTemplateUpdateController
} from './EventTemplate.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('EventTemplate controller', () => {
  describe('EventTemplateCreateController', () => {
    it('should create an CreateByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateCreateController).toBeInstanceOf(
        CreateByOwnerWorkerController
      );
      expect(EventTemplateCreateController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateCreateController['fromJson']).toBe(
        EventTemplateDTO.fromJson
      );
      expect(EventTemplateCreateController['fromClass']).toBe(
        EventTemplateDTO.fromClass
      );
      expect(EventTemplateCreateController['entityName']).toBe('EventTemplate');
      expect(EventTemplateCreateController['workerCreatePermission']).toBe(
        'createEventTemplates'
      );
    });
  });

  describe('EventTemplateUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(EventTemplateUpdateController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateUpdateController['fromJson']).toBe(
        EventTemplateDTO.fromJson
      );
      expect(EventTemplateUpdateController['entityName']).toBe('EventTemplate');
      expect(EventTemplateUpdateController['workerUpdatePermission']).toBe(
        'updateEventTemplates'
      );
    });
  });

  describe('EventTemplateDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(EventTemplateDeleteController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateDeleteController['entityName']).toBe('EventTemplate');
      expect(EventTemplateDeleteController['workerDeletePermission']).toBe(
        'deleteEventTemplates'
      );
    });
  });
});
