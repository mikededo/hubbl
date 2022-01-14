import { ValidationError } from 'class-validator';

export type ParsedValidation = {
  [type: string]: string[];
};

/**
 * Validates the errors revieved from the class-validator package
 */
export const validationParser = (
  errors: ValidationError[],
  nested = ''
): ParsedValidation => {
  const result: ParsedValidation = {};

  errors.forEach(({ constraints }) => {
    if (constraints) {
      Object.entries(constraints).forEach(([type, value]) => {
        const nestedValue = nested
          ? value.split('[').join(`[${nested}.`)
          : value;

        if (result[type]) {
          result[type].push(nestedValue);
        } else {
          result[type] = [nestedValue];
        }
      });
    }
  });

  return result;
};
