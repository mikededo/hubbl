import supertest = require('supertest');
import app from '../../main';

export const unauthorized = async (
  url: string,
  method: 'post' | 'put' | 'get' | 'delete'
) => {
  const response = await supertest(app)[method](url);

  expect(response.statusCode).toBe(401);
};
