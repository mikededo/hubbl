import * as Base from '../Base';
import { putter } from './putter';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { put: jest.fn() } };
});

describe('putter', () => {
  it('should be defined', () => {
    expect(putter).toBeDefined();
  });

  it('should call axios', async () => {
    (Base.axios.put as any).mockResolvedValue({});

    await putter('/api/url', { id: 1 }, { withCredentials: true });

    expect(Base.axios.put).toHaveBeenCalledTimes(1);
    expect(Base.axios.put).toHaveBeenCalledWith(
      '/api/url',
      { id: 1 },
      {
        withCredentials: true
      }
    );
  });
});
