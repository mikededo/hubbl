import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import supertest = require('supertest');

import app from '../../main';
import * as util from '../util';
import { ENTITY_IDENTIFIERS } from '../util';

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);

  const loginRes = await testApp.post(`/persons/login/${by}`).send({
    email: ENTITY_IDENTIFIERS[`${by.toUpperCase()}_EMAIL`],
    password: `${by}-password`
  });

  expect(loginRes.statusCode).toBe(200);

  const fetchRes = await testApp
    .get('/event-templates')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(200);
  expect(fetchRes.body).toBeDefined();
  expect(fetchRes.body.length).toBeGreaterThanOrEqual(4);
  // Ensure templates have eventCount defined
  expect(
    fetchRes.body.every(
      (template: EventTemplateDTO) => 'eventCount' in template
    )
  ).toBeTruthy();
};

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);

  const loginRes = await testApp.post(`/persons/login/${by}`).send({
    email: ENTITY_IDENTIFIERS[`${by.toUpperCase()}_EMAIL`],
    password: `${by}-password`
  });

  expect(loginRes.statusCode).toBe(200);

  // Create the event type
  const createRes = await testApp
    .post('/event-templates')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'created-event-template',
      description: 'Event Template description',
      type: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO,
      gym: loginRes.body[by].gym.id
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.description);
  util.toBeNumber(createRes.body.type);
  util.toBeNumber(createRes.body.gym);

  // Update the event type
  const updatedRes = await testApp
    .put('/event-templates')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'updated-event-template',
      description: 'Event Template description',
      type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
      gym: loginRes.body[by].gym.id
    });

  expect(updatedRes.statusCode).toBe(200);

  // Finally delete the event type
  const deleteRes = await testApp
    .delete(`/event-templates/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
