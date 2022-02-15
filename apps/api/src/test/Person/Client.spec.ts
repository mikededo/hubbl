import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { AppTheme, Gender } from '@hubbl/shared/types';

import { ParsedToken } from '../../app/controllers/helpers';
import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const fetch = async () => {
  // Login as owner
  const loginResponse = await supertest(app).post('/persons/login/owner').send({
    email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
    password: 'owner-password'
  });

  expect(loginResponse.statusCode).toBe(200);
  util.expectTokenCookie(loginResponse);

  const fetchResponse = await supertest(app)
    .get('/persons/clients')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send();

  expect(fetchResponse.statusCode).toBe(200);
  expect(fetchResponse.body.length).toBe(3);
};

export const baseRegister = async () => {
  const testApp = supertest(app);

  const response = await testApp.post('/persons/client').send({
    email: 'registered@client.com',
    password: 'registered-password',
    firstName: 'Registerd',
    lastName: 'Client',
    phone: '000 000 000',
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
  util.toBeString(body.client.phone);
  util.toBeString(body.client.theme);
  util.toBeString(body.client.gender);
  util.toBeBoolean(body.client.covidPassport);
  expect(
    // Ensure password has been encripted
    await compare('registered-password', body.client.password)
  ).toBeTruthy();
  util.toBeNumber(body.client.gym);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/client').send({
    email: 'registered@client.com',
    password: 'registered-password'
  });

  // Basic checks
  expect(loginResponse.body.client).toBeDefined();
  expect(loginResponse.body.client.id).toBe(body.client.id);
};

export const codeRegister = async () => {
  const testApp = supertest(app);

  const response = await testApp
    .post(`/persons/register/client?code=${ENTITY_IDENTIFIERS.GYM_CODE}`)
    .send({
      email: 'registered.code@client.com',
      password: 'registered-password',
      firstName: 'Registerd',
      lastName: 'Client',
      phone: '000 000 000',
      gender: Gender.OTHER,
      covidPassport: true
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
  util.toBeString(body.client.phone);
  util.toBeString(body.client.theme);
  util.toBeString(body.client.gender);
  util.toBeBoolean(body.client.covidPassport);
  expect(
    // Ensure password has been encripted
    await compare('registered-password', body.client.password)
  ).toBeTruthy();
  util.toBeNumber(body.client.gym);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/client').send({
    email: 'registered.code@client.com',
    password: 'registered-password'
  });

  // Basic checks
  expect(loginResponse.body.client).toBeDefined();
  expect(loginResponse.body.client.id).toBe(body.client.id);
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
  util.toBeString(body.client.phone);
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
  const testApp = supertest(app);

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

  const response = await testApp
    .put('/persons/client')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: ENTITY_IDENTIFIERS.CLIENT,
      email: ENTITY_IDENTIFIERS.CLIENT_EMAIL,
      password: 'client-password',
      firstName: 'Registerd',
      lastName: 'Client',
      phone: '000 000 000',
      gender: Gender.OTHER,
      theme: AppTheme.DARK,
      covidPassport: true,
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(response.statusCode).toBe(200);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/client').send({
    email: ENTITY_IDENTIFIERS.CLIENT_EMAIL,
    password: 'client-password'
  });

  // Check the prop that has been changed
  expect(loginResponse.body.client).toBeDefined();
  expect(loginResponse.body.client.id).toBe(ENTITY_IDENTIFIERS.CLIENT);
  expect(loginResponse.body.client.theme).toBe(AppTheme.DARK);
};
