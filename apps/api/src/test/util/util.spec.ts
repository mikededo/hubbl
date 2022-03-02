import request = require('superagent');

/**
 * Checks if the token cookie is set in the response
 */
export const expectTokenCookie = (response: request.Response) => {
  expect(response.headers['set-cookie'][0]).toMatch(
    /^(__hubbl-refresh__=).+(HttpOnly; Secure; SameSite=None)$/
  );
};

/**
 * Checks if the given value type is a string
 *
 * @param value The value to check for
 */
export const toBeString = (value: any) => {
  expect(typeof value).toBe('string');
};

/**
 * Checks if the given value type is a number
 *
 * @param value The value to check for
 */
export const toBeNumber = (value: any) => {
  expect(typeof value).toBe('number');
};

/**
 * Checks if the given value type is a boolean
 *
 * @param value The value to check for
 */
export const toBeBoolean = (value: any) => {
  expect(typeof value).toBe('boolean');
};
