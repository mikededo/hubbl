import { notForwardAny, notForwardOne, timeNormalizer } from './functions';

describe('functions', () => {
  describe('notForwardOne', () => {
    it('should return true if prop does not equal', () => {
      expect(notForwardOne('given')(3)).toBeTruthy();
    });

    it('should return false if prop equals', () => {
      expect(notForwardOne('prop')('prop')).toBeFalsy();
    });
  });

  describe('notForwardAny', () => {
    it('should return true on empty given', () => {
      expect(notForwardAny([])('prop')).toBeTruthy();
    });

    it('should return true if prop does not exist in the array', () => {
      expect(notForwardAny(['given', 'given'])('prop')).toBeTruthy();
    });

    it('should return false if the prop exists in the array', () => {
      expect(notForwardAny(['given', 'prop'])('prop')).toBeFalsy();
    });
  });

  describe('timeNormalizer', () => {
    it('should normalize the valid values', () => {
      const values = [
        { value: '', valid: '' },
        { value: '1', valid: '1' },
        { value: '12', valid: '12' },
        { value: '12:3', valid: '12:3' },
        { value: '12:34', valid: '12:34' },
        { value: '03:45', valid: '03:45' },
        { value: '23:55', valid: '23:55' }
      ];

      values.forEach(({ value, valid }) => {
        expect(timeNormalizer(value)).toBe(valid);
      });
    });

    it('should normalize the invalid values', () => {
      const values = [
        { value: '9', valid: '' },
        { value: '24', valid: '2' },
        { value: '12:6', valid: '12' },
        { value: '35:6', valid: '' },
        { value: '99:99', valid: '' },
      ];

      values.forEach(({ value, valid }) => {
        expect(timeNormalizer(value)).toBe(valid);
      });
    });
  });
});
