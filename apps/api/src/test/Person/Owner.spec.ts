import { compare } from 'bcrypt';
import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';

export const register = async () => {
  const response = await supertest(app)
    .post('/persons/register/owner')
    .send({
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
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/owner').send({
    email: 'test@owner.com',
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
