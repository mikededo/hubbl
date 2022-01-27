import { AppTheme } from '@hubbl/shared/types';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { ParsedToken } from '../../app/controllers/helpers';
import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const register = async () => {
  const testApp = supertest(app);

  const response = await testApp.post('/persons/register/owner').send({
    email: 'registered@owner.com',
    password: 'registered-password',
    firstName: 'Registerd',
    lastName: 'Owner',
    gender: 'OTHER',
    gym: {
      name: 'RegisteredGym',
      email: 'info@registered.com',
      phone: '000 000 000'
    }
  });

  expect(response.statusCode).toBe(201);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check fields
  util.toBeString(body.token);
  expect(body.owner).toBeDefined();
  util.toBeNumber(body.owner.id);
  util.toBeString(body.owner.email);
  util.toBeString(body.owner.password);
  util.toBeString(body.owner.firstName);
  util.toBeString(body.owner.lastName);
  util.toBeString(body.owner.theme);
  util.toBeString(body.owner.gender);
  expect(
    // Ensure password has been encripted
    await compare('registered-password', body.owner.password)
  ).toBeTruthy();
  util.toBeNumber(body.owner.gym.id);
  util.toBeString(body.owner.gym.name);
  util.toBeString(body.owner.gym.email);
  util.toBeString(body.owner.gym.phone);
  util.toBeString(body.owner.gym.color);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/owner').send({
    email: 'registered@owner.com',
    password: 'registered-password'
  });

  // Basic checks
  expect(loginResponse.body.owner).toBeDefined();
  expect(loginResponse.body.owner.id).toBe(body.owner.id);
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/owner').send({
    email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
    password: 'owner-password'
  });

  expect(response.statusCode).toBe(200);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check basic fields
  util.toBeString(body.token);
  expect(body.owner).toBeDefined();
  util.toBeNumber(body.owner.id);
  util.toBeString(body.owner.email);
  util.toBeString(body.owner.password);
  util.toBeString(body.owner.firstName);
  util.toBeString(body.owner.lastName);
  util.toBeString(body.owner.theme);
  util.toBeString(body.owner.gender);
  expect(await compare('owner-password', body.owner.password)).toBeTruthy();
  util.toBeNumber(body.owner.gym.id);
  util.toBeString(body.owner.gym.name);
  util.toBeString(body.owner.gym.email);
  util.toBeString(body.owner.gym.phone);
  util.toBeString(body.owner.gym.color);
  expect(Array.isArray(body.owner.gym.virtualGyms)).toBeTruthy();
};

export const update = async () => {
  const testApp = supertest(app);
  // Create the token
  const token = sign(
    {
      id: ENTITY_IDENTIFIERS.OWNER,
      email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
      user: 'owner'
    } as ParsedToken,
    'test-key'
  );

  const response = await testApp
    .put('/persons/owner')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: ENTITY_IDENTIFIERS.OWNER,
      email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
      password: 'test-password',
      firstName: 'Registerd',
      lastName: 'Owner',
      gender: 'OTHER',
      theme: AppTheme.DARK,
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(response.statusCode).toBe(200);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/owner').send({
    email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
    password: 'test-password'
  });

  // Check the prop changed, has actually be changed
  expect(loginResponse.body.owner).toBeDefined();
  expect(loginResponse.body.owner.id).toBe(ENTITY_IDENTIFIERS.OWNER);
  expect(loginResponse.body.owner.theme).toBe(AppTheme.DARK);
};
