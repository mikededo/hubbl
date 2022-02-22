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
