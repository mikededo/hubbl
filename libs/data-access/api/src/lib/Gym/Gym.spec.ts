import * as Base from '../Base';
import { update } from './Gym.api';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { put: jest.fn() } };
});

describe('Gym API', () => {
  describe('update', () => {
    it('should put to /gyms', async () => {
      (Base.axios.put as any).mockResolvedValue(undefined);

      await update({} as any, {});

      expect(Base.axios.put).toHaveBeenCalledTimes(1);
      expect(Base.axios.put).toHaveBeenCalledWith('/gyms', {}, {});
    });
  });
});
