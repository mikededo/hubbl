import BaseService from './Base.service';

/**
 * Mock class to use for the generic service
 */
class Mock {}

describe('BaseService', () => {
  describe('#constructor', () => {
    it('should create the repository with the correct arguments', () => {
      const mockRepoAccessor = jest.fn();

      new BaseService(Mock, mockRepoAccessor);

      expect(mockRepoAccessor).toHaveBeenCalledTimes(1);
      expect(mockRepoAccessor).toHaveBeenCalledWith(Mock, 'postgres');
    });
  });

  describe('#manager', () => {
    it('should return repository manager', () => {
      const mockRepository = { manager: { prop: 'manager' } };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      expect(service.manager).toStrictEqual(mockRepository.manager);
    });
  });

  describe('#save', () => {
    it('should save an item', async () => {
      const mockRepository = {
        save: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'test@email.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.save({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);

      expect(mockRepository.save).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);
    });
  });

  describe('#find', () => {
    it('should find one item', async () => {
      const mockRepository = {
        find: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'found@user.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.find({} as any);

      expect(mockRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('#findOne', () => {
    it('should find one item by id', async () => {
      const mockRepository = {
        findOne: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'found@user.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.findOne({ id: 1, options: {} as any });

      expect(mockRepository.findOne).toHaveBeenCalledWith(1, {});
    });

    it('should find one item by id', async () => {
      const mockRepository = {
        findOne: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: 1,
            email: 'found@user.com',
            password: 'hashed-pwd'
          })
        )
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.findOne({ options: {} as any });

      expect(mockRepository.findOne).toHaveBeenCalledWith({});
    });
  });

  describe('#update', () => {
    it('should update an item', async () => {
      const mockRepository = {
        update: jest.fn().mockImplementation(() => Promise.resolve({}))
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.update(1, {} as any);

      expect(mockRepository.update).toHaveBeenCalledWith(1, {});
    });
  });

  describe('#delete', () => {
    it('should delete an item', async () => {
      const mockRepository = {
        delete: jest.fn().mockImplementation(() => Promise.resolve({}))
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('#count', () => {
    it('should count how many items', async () => {
      const mockRepository = {
        count: jest.fn().mockImplementation(() => Promise.resolve(1))
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      await service.count({} as any);

      expect(mockRepository.count).toHaveBeenCalledWith({});
    });
  });

  describe('#createQueryBuilder', () => {
    it('should return the created query builder', () => {
      const mockRepository = {
        createQueryBuilder: jest.fn().mockReturnValue({})
      };
      const mockRepoAccessor = jest.fn().mockReturnValue(mockRepository) as any;

      const service = new BaseService(Mock, mockRepoAccessor);
      service.createQueryBuilder({
        alias: 'mock-alias',
        queryRunner: {} as any
      });

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'mock-alias',
        {}
      );
    });
  });
});
