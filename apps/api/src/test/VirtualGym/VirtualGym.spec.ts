import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const createVirtualGym = (
  app: supertest.SuperTest<supertest.Test>,
  token: string
) =>
  app.post('/virtual-gyms').set('Authorization', `Bearer ${token}`).send({
    name: 'created-virtual-gym',
    description: 'Virtual gym description',
    location: 'Any location, Somewhere',
    capacity: 10,
    openTime: '09:00:00',
    closeTime: '10:00:00',
    gym: ENTITY_IDENTIFIERS.GYM
  });

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);

  const loginRes = await testApp.post(`/persons/login/${by}`).send({
    email: ENTITY_IDENTIFIERS[`${by.toUpperCase()}_EMAIL`],
    password: `${by}-password`
  });

  expect(loginRes.statusCode).toBe(200);

  const fetchRes = await testApp
    .get('/virtual-gyms')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(1);
};

export const createUpdateAndDeleteByOwner = async () => {
  const testApp = supertest(app);

  const loginRes = await testApp.post('/persons/login/owner').send({
    email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
    password: 'owner-password'
  });

  expect(loginRes.statusCode).toBe(200);

  const createRes = await createVirtualGym(testApp, loginRes.body.token);

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeString(createRes.body.location);
  util.toBeNumber(createRes.body.capacity);
  util.toBeString(createRes.body.openTime);
  util.toBeString(createRes.body.closeTime);
  util.toBeNumber(createRes.body.gym);

  const updatedRes = await testApp
    .put('/virtual-gyms')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'updated-virtual-gym',
      description: 'Virtual gym description',
      location: 'Any location, Somewhere',
      capacity: 10,
      openTime: '09:00:00',
      closeTime: '10:00:00',
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(updatedRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(`/virtual-gyms/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};

export const createUpdateAndDeleteNotByOwner = async () => {
  const testApp = supertest(app);

  const loginRes = await testApp.post('/persons/login/worker').send({
    email: ENTITY_IDENTIFIERS.WORKER_EMAIL,
    password: 'worker-password'
  });
  expect(loginRes.statusCode).toBe(200);

  const createRes = await createVirtualGym(testApp, loginRes.body.token);
  expect(createRes.statusCode).toBe(403);
};
