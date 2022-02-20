import { fetch } from './fetch';

describe('fetch', () => {
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
  const mockService = { find: jest.fn() };

  const mockFromClass = jest.fn().mockReturnValue(parsedEntity);
  const mockController = { ok: jest.fn() };

  it('should run the query to the given service', async () => {
    mockService.find.mockResolvedValue([{}, {}]);

    await fetch({
      service: mockService as any,
      controller: mockController as any,
      res: {} as any,
      fromClass: mockFromClass as any,
      alias: 'e',
      gymId: 1,
      skip: 0
    });

    expect(mockService.find).toHaveBeenCalledTimes(1);
    expect(mockService.find).toHaveBeenCalledWith({
      join: { alias: 'e', innerJoin: { person: 'e.person' } },
      where: { person: { gym: 1 } },
      take: 25,
      skip: 0
    });
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
