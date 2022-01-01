import { Person } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import PersonService from './Person.service';

jest.mock('../Base');

describe('PersonService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      const mockRepoAccesser = jest.fn();

      new PersonService(mockRepoAccesser as any);

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Person, mockRepoAccesser);
    });
  });
});
