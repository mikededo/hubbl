import { Gender } from '@hubbl/shared/types';
import * as Base from '../Base';
import { login, signup } from './User.api';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { post: jest.fn() } };
});

describe('User API', () => {
  const mockPerson = {
    firstName: 'Test',
    lastName: 'Person',
    email: 'test@email.com',
    password: 'some-password'
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('signup', () => {
    it('should post to /persons/register/owner and return the registered owner', async () => {
      (Base.axios.post as any).mockResolvedValue({ data: { id: 1 } });

      const result = await signup('owner', mockPerson);

      expect(Base.axios.post).toHaveBeenCalledTimes(1);
      expect(Base.axios.post).toHaveBeenCalledWith(
        '/persons/register/owner',
        { ...mockPerson, gender: Gender.OTHER },
        { withCredentials: false }
      );

      expect(result.id).toBe(1);
    });
  });

  describe('login', () => {
    it('should post to /persons/login/owner and return the logged owner', async () => {
      (Base.axios.post as any).mockResolvedValue({ data: { id: 1 } });

      const result = await login('owner', {
        email: mockPerson.email,
        password: mockPerson.password
      });

      expect(Base.axios.post).toHaveBeenCalledTimes(1);
      expect(Base.axios.post).toHaveBeenCalledWith(
        '/persons/login/owner',
        { email: mockPerson.email, password: mockPerson.password },
        { withCredentials: false }
      );

      expect(result.id).toBe(1);
    });

    it('should post to /persons/login/worker and return the logged worker', async () => {
      (Base.axios.post as any).mockResolvedValue({ data: { id: 1 } });

      const result = await login('worker', {
        email: mockPerson.email,
        password: mockPerson.password
      });

      expect(Base.axios.post).toHaveBeenCalledTimes(1);
      expect(Base.axios.post).toHaveBeenCalledWith(
        '/persons/login/worker',
        { email: mockPerson.email, password: mockPerson.password },
        { withCredentials: false }
      );

      expect(result.id).toBe(1);
    });
  });
});
