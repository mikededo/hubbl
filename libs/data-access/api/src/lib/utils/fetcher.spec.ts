import * as Base from '../Base';
import { fetcher } from './fetcher';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { get: jest.fn() } };
});

describe('fetcher', () => {
  it('should be defined', () => {
    expect(fetcher).toBeDefined();
  });

  it('should call axios', async () => {
    (Base.axios.get as any).mockResolvedValue({});

    await fetcher('/api/url', { withCredentials: true });

    expect(Base.axios.get).toHaveBeenCalledTimes(1);
    expect(Base.axios.get).toHaveBeenCalledWith('/api/url', {
      withCredentials: true
    });
  });
});
