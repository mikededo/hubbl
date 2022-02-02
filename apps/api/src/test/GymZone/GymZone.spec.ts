import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const baseUrl = `/virtual-gyms/${ENTITY_IDENTIFIERS.VIRTUAL_GYM}/gym-zones`;

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get(baseUrl)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(3);
};

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  const createRes = await testApp
    .post(baseUrl)
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'created-gym-zone',
      description: 'Gym zone description',
      isClassType: true,
      capacity: 10,
      openTime: '09:00:00',
      closeTime: '21:00:00',
      virtualGym: ENTITY_IDENTIFIERS.VIRTUAL_GYM,
      maskRequired: true,
      covidPassport: true
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeNumber(createRes.body.capacity);
  util.toBeString(createRes.body.openTime);
  util.toBeString(createRes.body.closeTime);
  util.toBeNumber(createRes.body.virtualGym);
  util.toBeNumber(createRes.body.calendar);
  util.toBeBoolean(createRes.body.maskRequired);
  util.toBeBoolean(createRes.body.covidPassport);
  expect(createRes.body.timeIntervals).toBeDefined();

  const updatedRes = await testApp
    .put(baseUrl)
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'created-gym-zone',
      description: 'Gym zone description',
      isClassType: true,
      capacity: 10,
      openTime: '09:00:00',
      closeTime: '21:00:00',
      virtualGym: ENTITY_IDENTIFIERS.VIRTUAL_GYM,
      maskRequired: true,
      covidPassport: true,
      calendar: createRes.body.calendar,
      timeIntervals: createRes.body.timeIntervals
    });

  expect(updatedRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(`${baseUrl}/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
