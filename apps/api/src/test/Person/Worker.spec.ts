import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import supertest = require('supertest');

import { AppTheme, Gender, ParsedToken } from '@hubbl/shared/types';

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const checkWorkerProps = (worker: any) => {
  util.toBeNumber(worker.id);
  util.toBeString(worker.email);
  util.toBeString(worker.password);
  util.toBeString(worker.firstName);
  util.toBeString(worker.lastName);
  util.toBeString(worker.phone);
  util.toBeString(worker.theme);
  util.toBeString(worker.gender);
  util.toBeString(worker.workerCode);
  util.toBeBoolean(worker.createGymZones);
  util.toBeBoolean(worker.updateGymZones);
  util.toBeBoolean(worker.deleteGymZones);
  util.toBeBoolean(worker.createTrainers);
  util.toBeBoolean(worker.updateTrainers);
  util.toBeBoolean(worker.deleteTrainers);
  util.toBeBoolean(worker.createClients);
  util.toBeBoolean(worker.updateClients);
  util.toBeBoolean(worker.deleteClients);
  util.toBeBoolean(worker.createEvents);
  util.toBeBoolean(worker.updateEvents);
  util.toBeBoolean(worker.deleteEvents);
  util.toBeBoolean(worker.createEventTypes);
  util.toBeBoolean(worker.updateEventTypes);
  util.toBeBoolean(worker.deleteEventTypes);
  util.toBeBoolean(worker.createEventTemplates);
  util.toBeBoolean(worker.updateEventTemplates);
  util.toBeBoolean(worker.deleteEventTemplates);
  util.toBeBoolean(worker.createEventAppointments);
  util.toBeBoolean(worker.updateEventAppointments);
  util.toBeBoolean(worker.deleteEventAppointments);
  util.toBeBoolean(worker.createCalendarAppointments);
  util.toBeBoolean(worker.updateCalendarAppointments);
  util.toBeBoolean(worker.deleteCalendarAppointments);
};

export const fetch = async () => {
  // Login as owner
  const loginResponse = await supertest(app).post('/persons/login/owner').send({
    email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
    password: 'owner-password'
  });

  expect(loginResponse.statusCode).toBe(200);
  util.expectTokenCookie(loginResponse);

  const fetchResponse = await supertest(app)
    .get('/persons/workers')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send();

  expect(fetchResponse.statusCode).toBe(200);
  expect(fetchResponse.body.length).toBe(1);
};

export const register = async () => {
  const testApp = supertest(app);

  const response = await testApp.post('/persons/worker').send({
    email: 'registered@worker.com',
    password: 'registered-password',
    firstName: 'Test',
    lastName: 'Worker',
    phone: '000 000 000',
    gender: Gender.OTHER,
    managerId: ENTITY_IDENTIFIERS.OWNER,
    gym: ENTITY_IDENTIFIERS.GYM
  });

  expect(response.statusCode).toBe(201);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check basic fields
  util.toBeString(body.token);
  expect(body.worker).toBeDefined();
  expect(
    await compare('registered-password', body.worker.password)
  ).toBeTruthy();
  util.toBeNumber(body.worker.managerId);
  util.toBeNumber(body.worker.gym);
  checkWorkerProps(body.worker);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/worker').send({
    email: 'registered@worker.com',
    password: 'registered-password'
  });

  // Basic checks
  expect(loginResponse.body.worker).toBeDefined();
  expect(loginResponse.body.worker.id).toBe(body.worker.id);
};

export const login = async () => {
  // Use database data
  const response = await supertest(app).post('/persons/login/worker').send({
    email: ENTITY_IDENTIFIERS.WORKER_EMAIL,
    password: 'worker-password'
  });

  expect(response.statusCode).toBe(200);
  util.expectTokenCookie(response);

  // Body checks
  const { body } = response;

  // Check basic fields
  util.toBeString(body.token);
  expect(body.worker).toBeDefined();
  expect(await compare('worker-password', body.worker.password)).toBeTruthy();
  util.toBeNumber(body.worker.gym.id);
  util.toBeString(body.worker.gym.name);
  util.toBeString(body.worker.gym.email);
  util.toBeString(body.worker.gym.phone);
  util.toBeString(body.worker.gym.color);
  checkWorkerProps(body.worker);
};

export const update = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);

  // Create the token
  const token = sign(
    {
      id: by === 'owner' ? ENTITY_IDENTIFIERS.OWNER : ENTITY_IDENTIFIERS.WORKER,
      email: `test@${by}.com`,
      user: by
    } as ParsedToken,
    'test-key'
  );

  const response = await testApp
    .put('/persons/worker')
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: ENTITY_IDENTIFIERS.WORKER,
      email: ENTITY_IDENTIFIERS.WORKER_EMAIL,
      password: 'worker-password',
      firstName: 'Registerd',
      lastName: 'Worker',
      gender: 'OTHER',
      theme: AppTheme.DARK,
      createGymZones: true,
      updateGymZones: true,
      deleteGymZones: true,
      createTrainers: true,
      updateTrainers: true,
      deleteTrainers: true,
      createClients: true,
      updateClients: true,
      deleteClients: true,
      createEvents: true,
      updateEvents: true,
      deleteEvents: true,
      createEventTypes: true,
      updateEventTypes: true,
      deleteEventTypes: true,
      createEventTemplates: true,
      updateEventTemplates: true,
      deleteEventTemplates: true,
      createEventAppointments: true,
      updateEventAppointments: true,
      deleteEventAppointments: true,
      createCalendarAppointments: true,
      updateCalendarAppointments: true,
      deleteCalendarAppointments: true
    });

  expect(response.statusCode).toBe(200);

  // Check if the person exists in the database, by logging in
  const loginResponse = await testApp.post('/persons/login/worker').send({
    email: ENTITY_IDENTIFIERS.WORKER_EMAIL,
    password: 'worker-password'
  });

  // Check the prop changed, has actually be changed
  expect(loginResponse.body.worker).toBeDefined();
  expect(loginResponse.body.worker.id).toBe(ENTITY_IDENTIFIERS.WORKER);
  expect(loginResponse.body.worker.theme).toBe(AppTheme.DARK);
};
