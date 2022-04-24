import { sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { AppTheme, Gender, ParsedToken } from '@hubbl/shared/types';

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
    .get('/persons/trainers')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send();

  expect(fetchResponse.statusCode).toBe(200);
  expect(fetchResponse.body.length).toBe(1);
};

export const register = async () => {
  const response = await supertest(app).post('/persons/trainer').send({
    email: 'registered@trainer.com',
    firstName: 'Registerd',
    lastName: 'Trainer',
    phone: '000 000 000',
    gender: Gender.OTHER,
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
  util.toBeString(body.trainer.phone);
  util.toBeString(body.trainer.theme);
  util.toBeString(body.trainer.gender);
  util.toBeNumber(body.trainer.gym);
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/trainer').send({
    email: ENTITY_IDENTIFIERS.TRAINER_EMAIL,
    password: 'trainer-password'
  });

  expect(response.statusCode).toBe(404);
};

export const update = async (by: 'owner' | 'worker') => {
  // Create the token
  const token = sign(
    {
      id: by === 'owner' ? ENTITY_IDENTIFIERS.OWNER : ENTITY_IDENTIFIERS.WORKER,
      email: `test@${by}.com`,
      user: by
    } as ParsedToken,
    'test-key'
  );

  const response = await supertest(app)
    .put('/persons/trainer')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: ENTITY_IDENTIFIERS.TRAINER,
      email: ENTITY_IDENTIFIERS.TRAINER_EMAIL,
      password: 'trainer-password',
      firstName: 'Trainer',
      lastName: 'Worker',
      gender: 'OTHER',
      theme: AppTheme.DARK
    });

  expect(response.statusCode).toBe(200);
};
