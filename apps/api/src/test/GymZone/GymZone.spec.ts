import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const baseUrl = `/virtual-gyms/${ENTITY_IDENTIFIERS.VIRTUAL_GYM}/gym-zones`;

const gymZoneFields = (body: any) => {
  util.toBeNumber(body.id);
  util.toBeString(body.name);
  util.toBeString(body.description);
  util.toBeNumber(body.capacity);
  util.toBeString(body.openTime);
  util.toBeString(body.closeTime);
  util.toBeNumber(body.virtualGym);
  util.toBeNumber(body.calendar);
  util.toBeBoolean(body.maskRequired);
  util.toBeBoolean(body.covidPassport);
  expect(body.timeIntervals).toBeDefined();
};

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

export const fetchSingle = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get(`${baseUrl}/${ENTITY_IDENTIFIERS.GYM_ZONE_ONE}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  gymZoneFields(fetchRes.body);
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
  gymZoneFields(createRes.body);

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
