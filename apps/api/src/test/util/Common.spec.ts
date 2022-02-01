import request = require('superagent');
import supertest = require('supertest');

import app from '../../main';
import { ENTITY_IDENTIFIERS } from './constants';

const login = async (
  app: supertest.SuperTest<supertest.Test>,
  by: 'owner' | 'worker' | 'client'
): Promise<request.Response> => {
  const loginRes = await app.post(`/persons/login/${by}`).send({
    email: ENTITY_IDENTIFIERS[`${by.toUpperCase()}_EMAIL`],
    password: `${by}-password`
  });

  expect(loginRes.statusCode).toBe(200);

  return loginRes;
};

export const loginByOwner = (app: supertest.SuperTest<supertest.Test>) =>
  login(app, 'owner');

export const loginByWorker = (app: supertest.SuperTest<supertest.Test>) =>
  login(app, 'worker');

export const loginByOwnerOrWorker = (
  app: supertest.SuperTest<supertest.Test>,
  by: 'owner' | 'worker'
) => login(app, by);

export const loginByAny = (
  app: supertest.SuperTest<supertest.Test>,
  by: 'owner' | 'worker' | 'client'
) => login(app, by);

export const unauthorized = async (
  url: string,
  method: 'post' | 'put' | 'get' | 'delete'
) => {
  const response = await supertest(app)[method](url);

  expect(response.statusCode).toBe(401);
};
