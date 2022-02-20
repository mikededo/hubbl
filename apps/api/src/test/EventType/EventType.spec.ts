import supertest = require('supertest');

import { AppPalette } from '@hubbl/shared/types';

import app from '../../main';
import * as util from '../util';

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get('/event-types')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBeGreaterThanOrEqual(2);
};

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  // Create the event type
  const createRes = await testApp
    .post('/event-types')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'created-event-type',
      description: 'Event type description',
      labelColor: AppPalette.EMERALD,
      gym: loginRes.body[by].gym.id
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeString(createRes.body.labelColor);
  util.toBeNumber(createRes.body.gym);

  // Update the event type
  const updatedRes = await testApp
    .put('/event-types')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'updated-event-type',
      description: 'Event type description',
      labelColor: AppPalette.BLUE,
      gym: loginRes.body[by].gym.id
    });

  expect(updatedRes.statusCode).toBe(200);

  // Finally delete the event type
  const deleteRes = await testApp
    .delete(`/event-types/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
