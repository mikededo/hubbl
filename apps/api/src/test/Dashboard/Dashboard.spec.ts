import supertest = require('supertest');
import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchResult = await testApp
    .get(`/dashboards/${ENTITY_IDENTIFIERS.GYM}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchResult.statusCode).toBe(200);
  expect(fetchResult.body).toBeDefined();
  expect(fetchResult.body.virtualGyms).toBeDefined();
  expect(fetchResult.body.gymZones).toBeDefined();
  expect(fetchResult.body.todayEvents).toBeDefined();
  expect(fetchResult.body.events).toBeDefined();

  if (by === 'client') {
    expect(fetchResult.body.trainers).not.toBeDefined();
    expect(fetchResult.body.templates).not.toBeDefined();
  } else {
    expect(fetchResult.body.trainers).toBeDefined();
    expect(fetchResult.body.templates).toBeDefined();
  }
};
