import { Owner } from '@gymman/shared/models/entities';

import OwnerService from './Owner.service';

describe('OwnerService', () => {
  describe('#constructor', () => {
    it('should create the repository with the correct arguments', () => {
      const mockRepoAccesser = jest.fn();

      new OwnerService(mockRepoAccesser);

      expect(mockRepoAccesser).toHaveBeenCalledTimes(1);
      expect(mockRepoAccesser).toHaveBeenCalledWith(Owner, 'postgres');
    });
  });

  describe('#save', () => {
    it('should save an owner', () => {
      const mockRepository = {
        save: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'test@email.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccesser = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new OwnerService(mockRepoAccesser);
      service.save({ email: 'test@email.com', password: 'hashed-pwd' } as any);

      expect(mockRepository.save).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);
    });
  });
});
