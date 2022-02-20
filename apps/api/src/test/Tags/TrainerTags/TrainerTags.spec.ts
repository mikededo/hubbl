import supertest = require('supertest');

import { AppPalette } from '@hubbl/shared/types';

import app from '../../../main';
import * as util from '../../util';
import { ENTITY_IDENTIFIERS } from '../../util';

export const fetch = async (by: 'owner' | 'worker' | 'client') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByAny(testApp, by);

  const fetchRes = await testApp
    .get('/tags/trainer')
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(fetchRes.statusCode).toBe(by === 'client' ? 403 : 200);

  if (by !== 'client') {
    expect(fetchRes.body).toBeDefined();
    expect(fetchRes.body.length).toBe(4);
  }
};

export const createUpdateAndDelete = async (by: 'owner' | 'worker') => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, by);

  const createRes = await testApp
    .post('/tags/trainer')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      name: 'Created Tag',
      color: AppPalette.PINK,
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(createRes.statusCode).toBe(201);
  expect(createRes.body).toBeDefined();
  util.toBeNumber(createRes.body.id);
  util.toBeString(createRes.body.name);
  util.toBeString(createRes.body.color);
  util.toBeNumber(createRes.body.gym);

  const updatedRes = await testApp
    .put(`/tags/trainer/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: createRes.body.id,
      name: 'Updated Tag',
      color: AppPalette.ORANGE,
      gym: ENTITY_IDENTIFIERS.GYM
    });

  expect(updatedRes.statusCode).toBe(200);

  const deleteRes = await testApp
    .delete(`${'/tags/trainer'}/${createRes.body.id}`)
    .set('Authorization', `Bearer ${loginRes.body.token}`);

  expect(deleteRes.statusCode).toBe(200);
};
