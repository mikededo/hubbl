import supertest = require('supertest');

import app from '../../main';
import { ENTITY_IDENTIFIERS } from '../util';
import * as util from '../util';

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);

  const loginRes = await testApp.post(`/persons/login/${by}`).send({
    email: ENTITY_IDENTIFIERS[`${by.toUpperCase()}_EMAIL`],
    password: `${by}-password`
  });

  expect(loginRes.statusCode).toBe(200);

  const createRes = await testApp
    .post('/events')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'Event',
      description: 'Event of a calendar',
      capacity: 5,
      covidPassport: true,
      maskRequired: true,
      startTime: '17:00:00',
      endTime: '18:00:00',
      trainer: ENTITY_IDENTIFIERS.TRAINER,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
      template: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    });

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
  util.toBeNumber(createRes.body.trainer);
  util.toBeNumber(createRes.body.calendar);
  util.toBeNumber(createRes.body.template);
  expect(createRes.body.date).toBeDefined();
  util.toBeNumber(createRes.body.date.year);
  util.toBeNumber(createRes.body.date.month);
  util.toBeNumber(createRes.body.date.day);

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
      trainer: ENTITY_IDENTIFIERS.TRAINER,
      calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
      template: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
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
