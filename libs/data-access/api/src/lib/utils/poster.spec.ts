import * as Base from '../Base';
import { poster } from './poster';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { post: jest.fn() } };
});

describe('poster', () => {
  it('should be defined', () => {
    expect(poster).toBeDefined();
  });

  it('should call axios', async () => {
    (Base.axios.post as any).mockResolvedValue({});

    await poster('/api/url', { id: 1 }, { withCredentials: true });

    expect(Base.axios.post).toHaveBeenCalledTimes(1);
    expect(Base.axios.post).toHaveBeenCalledWith(
      '/api/url',
      { id: 1 },
      {
        withCredentials: true
      }
    );
  });
});
