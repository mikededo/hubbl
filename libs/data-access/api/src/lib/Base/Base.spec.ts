import axios from 'axios';
import { UnauthApiInstance, AuthApiInstance } from './Base.api';

describe('Base.api', () => {
  const createSpy = jest.spyOn(axios, 'create');

  it('should create an unauthorized instance', () => {
    UnauthApiInstance('endpoint');

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: `localhost:3333/api/endpoint`
    });
  });

  it('should create an authorized instance', () => {
    AuthApiInstance('endpoint', 'some-jwt-token');

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: `localhost:3333/api/endpoint`,
      headers: { Authorization: 'Bearer some-jwt-token' }
    });
  });
});
