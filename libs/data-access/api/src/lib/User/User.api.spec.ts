import { Gender } from '@hubbl/shared/types';

import * as Base from '../Base';
import { client, login, owner, signup, worker } from './User.api';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { post: jest.fn(), put: jest.fn() } };
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
      (Base.axios.post as any).mockResolvedValue({
        data: { owner: { id: 1 }, token: 'token' }
      });

      const result = await signup('owner', mockPerson);

      expect(Base.axios.post).toHaveBeenCalledTimes(1);
      expect(Base.axios.post).toHaveBeenCalledWith(
        '/persons/register/owner',
        { ...mockPerson, gender: Gender.OTHER },
        { withCredentials: false }
      );

      expect(result.owner.id).toBe(1);
      expect(result.token).toBe('token');
    });
  });

  describe('login', () => {
    it('should post to /persons/login/owner and return the logged owner', async () => {
      (Base.axios.post as any).mockResolvedValue({
        data: { owner: { id: 1 }, token: 'token' }
      });

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

      expect(result.owner.id).toBe(1);
      expect(result.token).toBe('token');
    });

    it('should post to /persons/login/worker and return the logged worker', async () => {
      (Base.axios.post as any).mockResolvedValue({
        data: { worker: { id: 1 }, token: 'token' }
      });

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

      expect(result.worker.id).toBe(1);
      expect(result.token).toBe('token');
    });
  });

  describe('update', () => {
    it('should put to /persons/owner', async () => {
      (Base.axios.put as any).mockResolvedValue({ data: { id: 1 } });

      await owner.update(
        {
          id: 1,
          firstName: 'Updated',
          lastName: 'Owner',
          email: 'test@email.com',
          password: 'updated-password'
        } as any,
        { withCredentials: true }
      );

      expect(Base.axios.put).toHaveBeenCalledTimes(1);
      expect(Base.axios.put).toHaveBeenCalledWith(
        '/persons/owner',
        {
          id: 1,
          firstName: 'Updated',
          lastName: 'Owner',
          email: 'test@email.com',
          password: 'updated-password'
        },
        { withCredentials: true }
      );
    });

    it('should put to /persons/worker', async () => {
      (Base.axios.put as any).mockResolvedValue({ data: { id: 1 } });

      await worker.update({
        id: 1,
        firstName: 'Updated',
        lastName: 'Worker',
        email: 'test@email.com',
        password: 'updated-password'
      } as any);

      expect(Base.axios.put).toHaveBeenCalledTimes(1);
      expect(Base.axios.put).toHaveBeenCalledWith(
        '/persons/worker',
        {
          id: 1,
          firstName: 'Updated',
          lastName: 'Worker',
          email: 'test@email.com',
          password: 'updated-password'
        },
        undefined
      );
    });

    it('should put to /persons/client', async () => {
      (Base.axios.put as any).mockResolvedValue({ data: { id: 1 } });

      await client.update({
        id: 1,
        firstName: 'Updated',
        lastName: 'Client',
        email: 'test@email.com',
        password: 'updated-password'
      } as any);

      expect(Base.axios.put).toHaveBeenCalledTimes(1);
      expect(Base.axios.put).toHaveBeenCalledWith(
        '/persons/client',
        {
          id: 1,
          firstName: 'Updated',
          lastName: 'Client',
          email: 'test@email.com',
          password: 'updated-password'
        },
        undefined
      );
    });
  });
});
