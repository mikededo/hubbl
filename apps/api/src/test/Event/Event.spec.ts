import { AppPalette } from '@hubbl/shared/types';
import request = require('superagent');
import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

const createChecks = (createRes: request.Response, template?: false) => {
  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeNumber(createRes.body.capacity);
  util.toBeBoolean(createRes.body.covidPassport);
  util.toBeBoolean(createRes.body.maskRequired);
  util.toBeString(createRes.body.startTime);
  util.toBeString(createRes.body.endTime);
  util.toBeNumber(createRes.body.difficulty);
  util.toBeString(createRes.body.color);
  util.toBeNumber(createRes.body.trainer);
  util.toBeNumber(createRes.body.calendar);
  util.toBeNumber(createRes.body.eventType);
  expect(createRes.body.date).toBeDefined();
  util.toBeNumber(createRes.body.date.year);
  util.toBeNumber(createRes.body.date.month);
  util.toBeNumber(createRes.body.date.day);

  if (template) {
    util.toBeNumber(createRes.body.template);
  }
};

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  const createRes = await testApp
    .post('/events')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'Event',
      description: 'Event of a calendar',
      startTime: '17:00:00',
      endTime: '18:00:00',
      trainer: ENTITY_IDENTIFIERS.TRAINER,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
      template: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
      eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
      gym: ENTITY_IDENTIFIERS.GYM,
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    });

  createChecks(createRes);

  const updateRes = await testApp
    .put('/events')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'Event',
      description: 'Event of a calendar',
      capacity: 5,
      covidPassport: false,
      maskRequired: false,
      startTime: '18:00:00',
      endTime: '20:00:00',
      color: AppPalette.ORANGE,
      trainer: ENTITY_IDENTIFIERS.TRAINER,
      difficulty: 1,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
      template: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
      eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
      gym: ENTITY_IDENTIFIERS.GYM,
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    });

  expect(updateRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(`/events/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};

export const createNoTemplate = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  const createRes = await testApp
    .post('/events')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'Event',
      description: 'Event of a calendar',
      capacity: 5,
      covidPassport: true,
      maskRequired: true,
      startTime: '16:00:00',
      endTime: '16:30:00',
      color: AppPalette.RED,
      eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
      trainer: ENTITY_IDENTIFIERS.TRAINER,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
      gym: ENTITY_IDENTIFIERS.GYM,
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    });
  createChecks(createRes);

  const deleteRes = await testApp
    .delete(`/events/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
