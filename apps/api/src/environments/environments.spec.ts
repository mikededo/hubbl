import * as prod from './environment.prod';
import * as env from './environment';

describe('Environments', () => {
  it('should have production set to true', () => {
    expect(prod.environment.production).toBeTruthy();
  });

  it('should have production set to false', () => {
    expect(env.environment.production).toBeFalsy();
  });
});
