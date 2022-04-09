import { EventTemplate } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import EventTemplateService from './EventTemplate.service';

jest.mock('../Base');

describe('EventTemplateService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new EventTemplateService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(EventTemplate);
    });
  });
});
