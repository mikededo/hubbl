import { DataSource } from 'typeorm';

import BaseService from './Base.service';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  const getRepository = {
    manager: {},
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn()
  };
  const dataSource = {
    manager: {
      getRepository: jest.fn().mockReturnValue(getRepository)
    }
  };

  return {
    ...actual,
    DataSource: jest.fn().mockReturnValue(dataSource)
  };
});

class Mock {}

describe('BaseService', () => {
  describe('#manager', () => {
    it('should return repository manager', () => {
      const service = new BaseService(Mock);
      expect(service.manager).toStrictEqual({});
    });
  });

  describe('#save', () => {
    it('should save an item', async () => {
      const service = new BaseService(Mock);
      await service.save({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).save
      ).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'hashed-pwd'
      } as any);
    });
  });

  describe('#find', () => {
    it('should find one item', async () => {
      const service = new BaseService(Mock);
      await service.find({} as any);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).find
      ).toHaveBeenCalledWith({});
    });
  });

  describe('#findOne', () => {
    it('should find one item', async () => {
      const service = new BaseService(Mock);
      await service.findOne({ where: { id: 1 } });

      expect(
        new DataSource({} as any).manager.getRepository({} as any).findOne
      ).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });

  describe('#findOneBy', () => {
    it('should find one item by id', async () => {
      const service = new BaseService(Mock);
      await service.findOneBy({ id: 1 } as any);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).findOneBy
      ).toHaveBeenCalledWith({
        id: 1
      });
    });
  });

  describe('#update', () => {
    it('should update an item', async () => {
      const service = new BaseService(Mock);
      await service.update(1, {} as any);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).update
      ).toHaveBeenCalledWith(1, {});
    });
  });

  describe('#delete', () => {
    it('should delete an item', async () => {
      const service = new BaseService(Mock);
      await service.delete(1);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).delete
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('#count', () => {
    it('should count how many items', async () => {
      const service = new BaseService(Mock);
      await service.count({} as any);

      expect(
        new DataSource({} as any).manager.getRepository({} as any).count
      ).toHaveBeenCalledWith({});
    });
  });

  describe('#createQueryBuilder', () => {
    it('should return the created query builder', () => {
      const service = new BaseService(Mock);
      service.createQueryBuilder({
        alias: 'mock-alias',
        queryRunner: {} as any
      });

      expect(
        new DataSource({} as any).manager.getRepository({} as any)
          .createQueryBuilder
      ).toHaveBeenCalledWith('mock-alias', {});
    });
  });
});
