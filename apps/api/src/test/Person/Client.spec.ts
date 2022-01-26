import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { AppTheme, Gender } from '@hubbl/shared/types';

import { ParsedToken } from '../../app/controllers/helpers';
import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const register = async () => {
  const response = await supertest(app).post('/persons/register/client').send({
    email: 'registered@client.com',
    password: 'registered-password',
    firstName: 'Registerd',
    lastName: 'Client',
    gender: Gender.OTHER,
    covidPassport: true,
    gym: ENTITY_IDENTIFIERS.GYM
  });

  expect(response.statusCode).toBe(201);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check fields
  util.toBeString(body.token);
  expect(body.client).toBeDefined();
  util.toBeNumber(body.client.id);
  util.toBeString(body.client.email);
  util.toBeString(body.client.password);
  util.toBeString(body.client.firstName);
  util.toBeString(body.client.lastName);
  util.toBeString(body.client.theme);
  util.toBeString(body.client.gender);
  util.toBeBoolean(body.client.covidPassport);
  expect(
    // Ensure password has been encripted
    await compare('registered-password', body.client.password)
  ).toBeTruthy();
  util.toBeNumber(body.client.gym);
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/client').send({
    email: ENTITY_IDENTIFIERS.CLIENT_EMAIL,
    password: 'client-password'
  });

  expect(response.statusCode).toBe(200);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check basic fields
  util.toBeString(body.token);
  expect(body.client).toBeDefined();
  util.toBeNumber(body.client.id);
  util.toBeString(body.client.email);
  util.toBeString(body.client.password);
  util.toBeString(body.client.firstName);
  util.toBeString(body.client.lastName);
  util.toBeString(body.client.theme);
  util.toBeString(body.client.gender);
  util.toBeBoolean(body.client.covidPassport);
  expect(await compare('client-password', body.client.password)).toBeTruthy();
  util.toBeNumber(body.client.gym.id);
  util.toBeString(body.client.gym.name);
  util.toBeString(body.client.gym.email);
  util.toBeString(body.client.gym.phone);
  util.toBeString(body.client.gym.color);
  expect(Array.isArray(body.client.gym.virtualGyms)).toBeTruthy();
};

export const update = async (by: 'client' | 'owner' | 'worker') => {
  // Create the token
  const token = sign(
    {
      id:
        by === 'client'
          ? ENTITY_IDENTIFIERS.CLIENT
          : by === 'owner'
          ? ENTITY_IDENTIFIERS.OWNER
          : ENTITY_IDENTIFIERS.WORKER,
      email: `test@${by}.com`,
      user: by
    } as ParsedToken,
    'test-key'
  );

  const response = await supertest(app)
    .put('/persons/client')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: ENTITY_IDENTIFIERS.CLIENT,
      email: ENTITY_IDENTIFIERS.CLIENT_EMAIL,
      password: 'registered-password',
      firstName: 'Registerd',
      lastName: 'Client',
      gender: Gender.OTHER,
      theme: AppTheme.DARK,
      covidPassport: true,
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(response.statusCode).toBe(200);
};
