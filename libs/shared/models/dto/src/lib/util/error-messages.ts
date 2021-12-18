export const stringError = <T>(type: new () => T, prop: string) =>
  `[${type.name}#${prop}] Should be a string`;

export const numberError = <T>(type: new () => T, prop: string) =>
  `[${type.name}#${prop}] Should be a number`;

export const enumError = <T>(type: new () => T, enumName: string, prop: string) =>
  `[${type.name}#${prop}] Should be a ${enumName} enum value`;

export const lengthError = <T>(
  type: new () => T,
  prop: string,
  min: number,
  max?: number
) =>
  max
    ? `[${type.name}#${prop}] Should have a min length of ${min} and max length of ${max}`
    : `[${type.name}#${prop}] Should have a min length of ${min}`;

export const emailError = <T>(type: new () => T) =>
  `[${type.name}] Email is not valid`;
