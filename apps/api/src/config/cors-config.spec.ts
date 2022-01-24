import corsConfig from './cors-config';

describe('Cors config', () => {
  it('should have set the cors config', () => {
    expect(corsConfig.origin).toStrictEqual(['*']);
  });
});
