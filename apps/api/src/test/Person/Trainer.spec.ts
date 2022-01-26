import { compare } from 'bcrypt';
import supertest = require('supertest');

import { Gender } from '@hubbl/shared/types';

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const register = async () => {
  const response = await supertest(app).post('/persons/register/trainer').send({
    email: 'registered@trainer.com',
    password: 'registered-password',
    firstName: 'Registerd',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    managerId: ENTITY_IDENTIFIERS.OWNER,
    gym: ENTITY_IDENTIFIERS.GYM
  });

  expect(response.statusCode).toBe(201);

  // Body checks
  const { body } = response;

  // Check fields
  expect(body.token).toBeUndefined();
  expect(body.trainer).toBeDefined();
  util.toBeNumber(body.trainer.id);
  util.toBeString(body.trainer.email);
  util.toBeString(body.trainer.password);
  util.toBeString(body.trainer.firstName);
  util.toBeString(body.trainer.lastName);
  util.toBeString(body.trainer.theme);
  util.toBeString(body.trainer.gender);
  expect(
    // Ensure password has been encripted
    await compare('registered-password', body.trainer.password)
  ).toBeTruthy();
  util.toBeNumber(body.trainer.gym);
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/trainer').send({
    email: 'test@trainer.com',
    password: 'trainer-password'
  });

  expect(response.statusCode).toBe(404);
};
