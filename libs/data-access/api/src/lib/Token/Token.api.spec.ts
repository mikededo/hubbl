import * as Base from '../Base';
import { validate } from './Token.api';

jest.mock('../Base', () => {
  const actual = jest.requireActual('../Base');

  return { ...actual, axios: { post: jest.fn() } };
});

describe('Token API', () => {
  describe('validate', () => {
    it('should post to /tokens/validate and return a parsed token', async () => {
      (Base.axios.post as any).mockResolvedValue({});

      await validate();

      expect(Base.axios.post).toHaveBeenCalledTimes(1);
      expect(Base.axios.post).toHaveBeenCalledWith('/tokens/validate');
    });
  });
});
