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
