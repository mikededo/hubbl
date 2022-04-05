import { SingleHandler } from '@hubbl/shared/types';

/**
 * Returns false if `prop` does not equal to `given`. It returns a function
 * since it is intended to be used in `shouldForwardProp`
 *
 * @param given Array of props to check for
 */
export const notForwardOne = (given: PropertyKey) => (prop: PropertyKey) =>
  prop !== given;

/**
 * Returns false if `prop` does not exist in `given`. It returns a function
 * since it is intended to be used in `shouldForwardProp`
 *
 * @param given Array of props to check for
 */
export const notForwardAny = (given: PropertyKey[]) => (prop: PropertyKey) =>
  !given.includes(prop);

/**
 * Normalizes/Masks the given string value to a 24h time format
 *
 * @param value The value to normalize/mask
 */
export const timeNormalizer = (value: string): string => {
  if (!value.length) {
    return '';
  }

  const splitted = value.split(':').join('');

  switch (splitted.substring(0, 4).length) {
    case 1:
      return /[0-2]/.test(splitted) ? value : '';
    case 2:
      return /([01][0-9]|2[0-3])/.test(splitted)
        ? value
        : timeNormalizer(value.substring(0, 1));
    case 3:
      return /([01][0-9]|2[0-3])[0-5]/.test(splitted)
        ? `${value.substring(0, 2)}:${value.charAt(value.length - 1)}`
        : timeNormalizer(value.substring(0, 2));
    case 4:
    default:
      return /([01][0-9]|2[0-3])[0-5][0-9]/.test(splitted)
        ? value.substring(0, 5)
        : timeNormalizer(
            `${value.substring(0, 2)}:${value.charAt(value.length - 1)}`
          );
  }
};

/**
 * Checks if `tb` is before `ta` in a 24h format
 *
 * @param ta The first time
 * @param tb The second time
 * @returns {boolean}
 */
export const isTimeBefore = (ta: string, tb: string): boolean => {
  // Validate the times
  const r = /([01][0-9]|2[0-3]):[0-5][0-9]/g;
  if (!r.test(ta) || r.test(tb)) {
    throw `Times are not valid [${ta}, ${tb}]`;
  }

  const tav = ta
    .split(':')
    .reduceRight((prev, curr, i) => prev + (i ? +curr * 60 * i : +curr), 0);
  const tbv = tb
    .split(':')
    .reduceRight((prev, curr, i) => prev + (i ? +curr * 60 * i : +curr), 0);

  return tbv < tav;
};

/**
 * Returns the first day as a date of the wanted week
 *
 * @param iteration The amount of weeks to go forward (negative int) or
 * backwards (positive int)
 * @returns The initial date of the week
 */
export const weekInitialDay: SingleHandler<number, Date> = (iteration): Date => {
  const initial = new Date();

  initial.setDate(
    initial.getDate() - initial.getDay() + (initial.getDay() === 0 ? -6 : 1)
  );
  initial.setDate(initial.getDate() - 7 * iteration);

  return initial;
};
