import { GymDTO } from '@hubbl/shared/models/dto';

import { GymService } from '../../services';
import { UpdateByOwnerController } from '../Base';
import { GymUpdateController } from './Gym.controller';

jest.mock('../../services');

describe('Gym controller', () => {
  describe('GymUpdateController', () => {
    it('should create an UpdateByOwnerController', () => {
      expect(GymUpdateController).toBeInstanceOf(UpdateByOwnerController);
      expect(GymUpdateController['serviceCtr']).toBe(GymService);
      expect(GymUpdateController['fromJson']).toBe(GymDTO.fromJson);
      expect(GymUpdateController['entityName']).toBe('Gym');
    });
  });
});
