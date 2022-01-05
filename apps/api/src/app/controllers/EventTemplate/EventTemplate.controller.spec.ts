import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService } from '../../services';
import { CreateByOwnerWorkerController } from '../Base';
import { EventTemplateCreateController } from './EventTemplate.controller';

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
});
