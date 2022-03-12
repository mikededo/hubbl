import { ENTITY_IDENTIFIERS } from '../util';
import * as util from '../util';
import supertest = require('supertest');
import app from '../../main';
import { AppPalette } from '@hubbl/shared/types';

export const update = async () => {
  const testApp = supertest(app);
  const loginRes = await util.common.loginByOwnerOrWorker(testApp, 'owner');

  const updateRes = await testApp
    .put('/gyms')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({
      id: ENTITY_IDENTIFIERS.GYM,
      name: 'UpdatedGym',
      email: 'updated@gym.com',
      phone: '000 000 000',
      color: AppPalette.RED,
      code: ENTITY_IDENTIFIERS.GYM_CODE
    });

  expect(updateRes.statusCode).toBe(200);
};
