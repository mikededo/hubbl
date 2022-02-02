import { GymZoneIntervals } from '@hubbl/shared/types';
import request = require('superagent');
import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const date = new Date();
date.setDate(date.getDate() + 1);

// Open and close time specified at e2e-setup.ts
const interval = GymZoneIntervals.HOUR;
const maxIntervals = (23 - 9) * 4 - interval / 15 + 1;
let hour = 9;
const intervals = [...Array(maxIntervals)].map((_, i) => {
  const quarter = 15 * (i % 4);
  hour = i > 0 && !(i % 4) ? hour + 1 : hour;

  return `${`${hour}`.padStart(2, '0')}:${`${quarter}`.padStart(2, '0')}:00`;
});

const commonCreate = async (
  app: supertest.SuperTest<supertest.Test>,
  token: string
): Promise<request.Response> => {
  const createRes = await app
    .post('/appointments/calendars')
    .set('Authorization', `Bearer ${token}`)
    .send({
      client: ENTITY_IDENTIFIERS.CLIENT,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_THREE,
      startTime: '09:00:00',
      endTime: '11:00:00',
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.startTime);
  util.toBeString(createRes.body.endTime);
  util.toBeBoolean(createRes.body.cancelled);
  util.toBeNumber(createRes.body.client);
  expect(createRes.body.client).toBe(ENTITY_IDENTIFIERS.CLIENT);
  util.toBeNumber(createRes.body.calendar);
  expect(createRes.body.calendar).toBe(ENTITY_IDENTIFIERS.CALENDAR_THREE);

  return createRes;
};

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get(`/appointments/calendars/${ENTITY_IDENTIFIERS.CALENDAR_THREE}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      interval
    });

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(intervals.length);
  expect(fetchRes.body).toStrictEqual(intervals);
};

export const createAndCancel = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);
  const createRes = await commonCreate(testApp, loginRes.body.token);

  const cancelRes = await testApp
    .put(
      `/appointments/calendars/${createRes.body.calendar}/cancel/${createRes.body.id}`
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
      `/appointments/calendars/${createRes.body.calendar}/cancel/${createRes.body.id}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(cancelRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(
      `/appointments/calendars/${createRes.body.calendar}/${createRes.body.id}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
