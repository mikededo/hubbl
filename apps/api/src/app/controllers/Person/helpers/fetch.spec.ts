import { fetch } from '.';

describe('fetch', () => {
  const rawEntity = {
    p_id: 1,
    p_email: 'test@entity.com',
    p_password: '$2b$10$zsQ.IYU10.xT7IXkoCuuFexFzW9adEgQw6bodSYWMmwM1LaPK6lXS',
    p_first_name: 'Test',
    p_last_name: 'Entity',
    p_phone: null,
    p_theme: 'LIGHT',
    p_gender: 'OTHER',
    p_gym_id: 1,
    e_value_one: 1,
    e_value_two_fk: 2,
    d_to_be_skipped: null
  };
  const parsedEntity = {
    id: 1,
    firstName: 'Test',
    lastName: 'Entity',
    email: 'test@entity.com',
    password: '$2b$10$zsQ.IYU10.xT7IXkoCuuFexFzW9adEgQw6bodSYWMmwM1LaPK6lXS',
    phone: null,
    theme: 'LIGHT',
    gender: 'OTHER',
    valueOne: 1,
    valueTwo: 2
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany: jest.fn()
  };
  const mockService = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
  };

  const mockFromClass = jest.fn().mockReturnValue(parsedEntity);
  const mockController = { ok: jest.fn() };

  it('should run the query to the given service', async () => {
    mockQueryBuilder.getRawMany.mockResolvedValue([rawEntity, rawEntity]);

    await fetch({
      service: mockService as any,
      controller: mockController as any,
      res: {} as any,
      fromClass: mockFromClass as any,
      alias: 'e',
      personFk: 'person_fk',
      gymId: 1,
      skip: 0
    });

    expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
      alias: 'e'
    });
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'person',
      'p'
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('p.gym = :gymId', {
      gymId: 1
    });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      `e.person_fk = p.id`
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.limit).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(25);
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
    expect(mockFromClass).toHaveBeenCalledTimes(2);
    expect(mockFromClass).toHaveNthReturnedWith(1, parsedEntity);
    expect(mockFromClass).toHaveNthReturnedWith(2, parsedEntity);
    expect(mockController.ok).toHaveBeenCalledTimes(1);
    expect(mockController.ok).toHaveBeenCalledWith({}, [
      parsedEntity,
      parsedEntity
    ]);
  });
});
