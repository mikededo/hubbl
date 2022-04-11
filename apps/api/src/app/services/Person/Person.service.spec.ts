import { Person } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import PersonService from './Person.service';

jest.mock('../Base');

describe('PersonService', () => {
  describe('#constructor', () => {
    it('should call super', () => {
      new PersonService();

      expect(BaseService).toHaveBeenCalled();
      expect(BaseService).toHaveBeenCalledWith(Person);
    });
  });
});
