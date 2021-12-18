import {
  emailError,
  enumError,
  lengthError,
  numberError,
  stringError
} from './error-messages';

class MockType {}

describe('error-messages', () => {
  describe('stringError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = stringError(MockType, 'prop');

      expect(res).toBeDefined();

      expect(res).toBe('[MockType#prop] Should be a string');
    });
  });

  describe('numberError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = numberError(MockType, 'prop');

      expect(res).toBeDefined();
      expect(res).toBe('[MockType#prop] Should be a number');
    });
  });

  describe('enumError', () => {
    it('should return an error message with the given type and prop', () => {
      const res = enumError(MockType, 'ExampleEnum', 'prop');

      expect(res).toBeDefined();
      expect(res).toBe('[MockType#prop] Should be a ExampleEnum enum value');
    });
  });

  describe('lengthError', () => {
    it('should return an error message with the given type, prop & min length', () => {
      const res = lengthError(MockType, 'password', 8);

      expect(res).toBeDefined();
      expect(res).toBe('[MockType#password] Should have a min length of 8');
    });

    it('should return an error message with the given type, prop, min & max length', () => {
      const res = lengthError(MockType, 'password', 8, 24);

      expect(res).toBeDefined();
      expect(res).toBe(
        '[MockType#password] Should have a min length of 8 and max length of 24'
      );
    });
  });

  describe('emailError', () => {
    it('should return an error message with the given type', () => {
      const res = emailError(MockType);

      expect(res).toBeDefined();
      expect(res).toBe('[MockType] Email is not valid');
    });
  });
});
