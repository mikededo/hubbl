import {
  arrayError,
  booleanError,
  emailError,
  enumError,
  lengthError,
  numberError,
  stringError
} from './error-messages';

describe('error-messages', () => {
  describe('stringError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = stringError('prop');

      expect(res).toBeDefined();

      expect(res).toBe('[prop] Should be a string');
    });
  });

  describe('numberError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = numberError('prop');

      expect(res).toBeDefined();
      expect(res).toBe('[prop] Should be a number');
    });
  });

  describe('booleanError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = booleanError('prop');

      expect(res).toBeDefined();
      expect(res).toBe('[prop] Should be a boolean');
    });
  });

  describe('arrayError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = arrayError('prop');

      expect(res).toBeDefined();
      expect(res).toBe('[prop] Should be an array');
    });
  });

  describe('enumError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = enumError('ExampleEnum', 'prop');

      expect(res).toBeDefined();
      expect(res).toBe('[prop] Should be a ExampleEnum enum value');
    });
  });

  describe('lengthError', () => {
    it('should return an error message with the given type, prop & min length', () => {
      const res = lengthError('password', 8);

      expect(res).toBeDefined();
      expect(res).toBe('[password] Should have a min length of 8');
    });

    it('should return an error message with the given type, prop, min & max length', () => {
      const res = lengthError('password', 8, 24);

      expect(res).toBeDefined();
      expect(res).toBe(
        '[password] Should have a min length of 8 and max length of 24'
      );
    });
  });

  describe('emailError', () => {
    it('should return an error message with the given type', () => {
      const res = emailError();

      expect(res).toBeDefined();
      expect(res).toBe('Email is not valid');
    });
  });
});
