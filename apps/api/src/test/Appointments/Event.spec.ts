import request = require('superagent');
import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const commonCreate = async (
  app: supertest.SuperTest<supertest.Test>,
  token: string
): Promise<request.Response> => {
  const createRes = await app
    .post('/appointments/events')
    .set('Authorization', `Bearer ${token}`)
    .send({
      client: ENTITY_IDENTIFIERS.CLIENT,
      event: ENTITY_IDENTIFIERS.EVENT_THREE
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.startTime);
  util.toBeString(createRes.body.endTime);
  util.toBeBoolean(createRes.body.cancelled);
  util.toBeNumber(createRes.body.client);
  expect(createRes.body.client).toBe(ENTITY_IDENTIFIERS.CLIENT);
  util.toBeNumber(createRes.body.event);
  expect(createRes.body.event).toBe(ENTITY_IDENTIFIERS.EVENT_THREE);

  return createRes;
};

export const createAndCancel = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);
  const createRes = await commonCreate(testApp, loginRes.body.token);

  const cancelRes = await testApp
    .put(
      `/appointments/events/${createRes.body.event}/cancel/${createRes.body.id}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(cancelRes.statusCode).toBe(200);
};

export const createCancelAndDelete = async (
  by: 'owner' | 'worker' | 'client'
) => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);
  const createRes = await commonCreate(testApp, loginRes.body.token);

  const cancelRes = await testApp
    .put(
      `/appointments/events/${createRes.body.event}/cancel/${createRes.body.id}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(cancelRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(`/appointments/events/${createRes.body.event}/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
