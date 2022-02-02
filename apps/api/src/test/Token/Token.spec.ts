import { decode, sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { ParsedToken } from '../../app/controllers/helpers';
import app from '../../main';
import { ENTITY_IDENTIFIERS } from '../util';

export const validate = async () => {
  const token = sign(
    {
      id: ENTITY_IDENTIFIERS.OWNER,
      email: 'test@token.com',
      user: 'owner'
    } as ParsedToken,
    process.env.NX_JWT_TOKEN
  );

  const response = await supertest(app)
    .post('/tokens/validate')
    .set('Cookie', `__hubbl-refresh__=${token}; HttpOnly`);

  expect(response.statusCode).toBe(200);
  expect(response.body.token).toBeDefined();

  const parsed: ParsedToken = decode(response.body.token) as any;
  expect(parsed.id).toBe(ENTITY_IDENTIFIERS.OWNER);
  expect(parsed.email).toBe('test@token.com');
  expect(parsed.user).toBe('owner');
};

export const refresh = async () => {
  const token = sign(
    {
      id: ENTITY_IDENTIFIERS.OWNER,
      email: 'test@token.com',
      user: 'owner'
    } as ParsedToken,
    process.env.NX_JWT_TOKEN
  );

  const response = await supertest(app)
    .post('/tokens/refresh')
    .send({ token })
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.token).toBeDefined();

  const parsed: ParsedToken = decode(response.body.token) as any;
  expect(parsed.id).toBe(ENTITY_IDENTIFIERS.OWNER);
  expect(parsed.email).toBe('test@token.com');
  expect(parsed.user).toBe('owner');
};
