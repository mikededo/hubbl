import { Gender } from '@hubbl/shared/types';
import * as Base from '../Base';
import { signup } from './User.api';

jest.mock('../Base');

describe('User API', () => {
  describe('signup', () => {
    const mockInstance = { post: jest.fn() };
    const mockPerson = {
      firstName: 'Test',
      lastName: 'Person',
      email: 'test@email.com',
      password: 'some-password'
    };
    const unauthInstanceSpy = jest
      .spyOn(Base, 'UnauthApiInstance')
      .mockReturnValue(mockInstance as any);

    it('should post to /persons/register/owner and return the registered owner', async () => {
      mockInstance.post.mockResolvedValue({});

      await signup('owner', mockPerson);

      expect(unauthInstanceSpy).toHaveBeenCalledTimes(1);
      expect(unauthInstanceSpy).toHaveBeenCalledWith('persons');
      expect(mockInstance.post).toHaveBeenCalledTimes(1);
      expect(mockInstance.post).toHaveBeenCalledWith('/register/owner', {
        ...mockPerson,
        gender: Gender.OTHER
      });
    });
  });
});
