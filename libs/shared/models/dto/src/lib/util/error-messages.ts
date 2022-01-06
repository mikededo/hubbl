export const stringError = (prop: string) => `[${prop}] Should be a string`;

export const numberError = (prop: string) => `[${prop}] Should be a number`;

export const booleanError = (prop: string) => `[${prop}] Should be a boolean`;

export const arrayError = (prop: string) => `[${prop}] Should be an array`;

export const enumError = (enumName: string, prop: string) =>
  `[${prop}] Should be a ${enumName} enum value`;

export const lengthError = (prop: string, min: number, max?: number) =>
  max
    ? `[${prop}] Should have a min length of ${min} and max length of ${max}`
    : `[${prop}] Should have a min length of ${min}`;

export const emailError = () => 'Email is not valid';

export const instanceError = (typeName: string, prop: string) =>
  `[${prop}] is not instance of "${typeName}"`;
