import {
  isTimeBefore,
  notForwardAny,
  notForwardOne,
  timeNormalizer,
  weekInitialDay
} from './functions';

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
        { value: '99:99', valid: '' }
      ];

      values.forEach(({ value, valid }) => {
        expect(timeNormalizer(value)).toBe(valid);
      });
    });
  });

  describe('isTimeBefore', () => {
    it('should throw on invalid a time', () => {
      try {
        isTimeBefore('aaaa', '09:00');
      } catch (e) {
        expect(e).toBe('Times are not valid [aaaa, 09:00]');
      }
    });

    it('should throw on invalid b time', () => {
      try {
        isTimeBefore('09:00', 'aaaa');
      } catch (e) {
        expect(e).toBe('Times are not valid [09:00, aaaa]');
      }
    });

    it('should return true if times are before', () => {
      const times = [
        { a: '01:00', b: '00:00' },
        { a: '15:30', b: '12:30' },
        { a: '23:00', b: '10:00' }
      ];

      times.map(({ a, b }) => {
        expect(isTimeBefore(a, b)).toBeTruthy();
      });
    });

    it('should return false if times are not before', () => {
      const times = [
        { a: '00:00', b: '01:00' },
        { a: '12:30', b: '15:30' },
        { a: '10:00', b: '23:00' }
      ];

      times.map(({ a, b }) => {
        expect(isTimeBefore(a, b)).toBeFalsy();
      });
    });
  });

  describe('weekIntialDay', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2022-06-27').getTime());
    });

    it('should return the first day of the current week', () => {
      const initial = weekInitialDay(0);

      expect(initial.getDay()).toBe(1);
    });

    it('should return the first day of the current week if it is sunday', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-07-03').getTime());

      const initial = weekInitialDay(0);

      expect(initial.getDay()).toBe(1);
    });

    it('should return the first day of the previous week', () => {
      const initial = weekInitialDay(1);

      expect(initial.getDay()).toBe(1);
      expect(
        Math.ceil(
          (new Date().getTime() - initial.getTime()) / (1000 * 3600 * 24)
        )
      ).toBe(7);
    });

    it('should return the first day of the next week', () => {
      const initial = weekInitialDay(-1);

      expect(initial.getDay()).toBe(1);
      expect(
        Math.ceil(
          (initial.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
        )
      ).toBe(7);
    });
  });
});
