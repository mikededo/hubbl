import { EventTemplate } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import EventTemplateService from './EventTemplate.service';

jest.mock('../Base');

describe('EventTemplateService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new EventTemplateService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(EventTemplate, mockRepoAccesser);
    });
  });
});
