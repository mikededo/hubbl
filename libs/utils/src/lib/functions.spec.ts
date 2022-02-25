import { notForwardAny, notForwardOne } from './functions';

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
});
