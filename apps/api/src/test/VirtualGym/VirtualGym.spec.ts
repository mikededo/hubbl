import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';
import { loginByOwner } from '../util/Common.spec';

const createVirtualGym = (
  app: supertest.SuperTest<supertest.Test>,
  token: string
) =>
  app.post('/virtual-gyms').set('Authorization', `Bearer ${token}`).send({
    name: 'created-virtual-gym',
    description: 'Virtual gym description',
    location: 'Any location, Somewhere',
    capacity: 10,
    phone: '987 654 321',
    openTime: '09:00:00',
    closeTime: '10:00:00',
    gym: ENTITY_IDENTIFIERS.GYM
  });

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get('/virtual-gyms')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(1);
  expect(fetchRes.body[0].gymZones).toBeDefined();
  expect(fetchRes.body[0].gymZones.length).toBe(3);
};

export const fetchLevel = async () => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, 'owner');

  const fetchRes = await testApp
    .get('/virtual-gyms?level=0')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(1);
  expect(fetchRes.body[0].gymZones).toBeDefined();
  expect(fetchRes.body[0].gymZones.length).toBe(0);
};

export const createUpdateAndDeleteByOwner = async () => {
  const testApp = supertest(app);
  const loginRes = await loginByOwner(testApp);

  const createRes = await createVirtualGym(testApp, loginRes.body.token);

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeString(createRes.body.location);
  util.toBeNumber(createRes.body.capacity);
  util.toBeString(createRes.body.phone);
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
      phone: '987, 654, 321',
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

  const loginRes = await util.common.loginByWorker(testApp);

  const createRes = await createVirtualGym(testApp, loginRes.body.token);
  expect(createRes.statusCode).toBe(403);
};
