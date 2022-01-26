import { compare } from 'bcrypt';
import supertest = require('supertest');

import { Gender } from '@hubbl/shared/types';

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
    email: 'test@client.com',
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
