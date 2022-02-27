import * as Base from '../Base';
import { validate } from './Token.api';

jest.mock('../Base');

describe('Token API', () => {
  describe('validate', () => {
    const mockInstance = { post: jest.fn() };
    const unauthInstanceSpy = jest
      .spyOn(Base, 'UnauthApiInstance')
      .mockReturnValue(mockInstance as any);

    it('should post to /tokens/validate and return a parsed token', async () => {
      mockInstance.post.mockResolvedValue({});

      await validate();

      expect(unauthInstanceSpy).toHaveBeenCalledTimes(1);
      expect(unauthInstanceSpy).toHaveBeenCalledWith('tokens');
      expect(mockInstance.post).toHaveBeenCalledTimes(1);
      expect(mockInstance.post).toHaveBeenCalledWith('/validate');
    });
  });
});
