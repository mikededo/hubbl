import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const date = new Date();
date.setDate(date.getDate() + 1);
const startDateParam = `${date.getFullYear()}-${`${
  date.getMonth() + 1
}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;

export const fetchEvents = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get(
      `/calendars/${ENTITY_IDENTIFIERS.CALENDAR_ONE}/events?startDate=${startDateParam}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(2);
  expect(fetchRes.body.map(({ calendar }) => calendar)).toStrictEqual([
    ENTITY_IDENTIFIERS.CALENDAR_ONE,
    ENTITY_IDENTIFIERS.CALENDAR_ONE
  ]);
};

export const fetchEventAppointments = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get(
      `/calendars/${ENTITY_IDENTIFIERS.CALENDAR_TWO}/events/${ENTITY_IDENTIFIERS.EVENT_TWO}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(3);
  expect(fetchRes.body.map(({ email }) => email)).toStrictEqual([
    ENTITY_IDENTIFIERS.CLIENT_EMAIL,
    ENTITY_IDENTIFIERS.CLIENT_EMAIL_TWO,
    ENTITY_IDENTIFIERS.CLIENT_EMAIL_THREE
  ]);
};

export const fetchCalendarAppointments = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  const fetchRes = await testApp
    .get(
      `/calendars/${ENTITY_IDENTIFIERS.CALENDAR_THREE}/calendars?date=${startDateParam}`
    )
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(3);
};

export const fetchCalendarTodayEvents = async (
  by: 'owner' | 'worker' | 'client'
) => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get('/calendars/today')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBe(2);
};
