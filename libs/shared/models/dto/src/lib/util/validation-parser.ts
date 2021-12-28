import { ValidationError } from 'class-validator';

export type ParsedValidation = {
  [type: string]: string[];
};

/**
 * Validates the errors revieved from the class-validator package
 */
export const validationParser = (
  errors: ValidationError[]
): ParsedValidation => {
  const result: ParsedValidation = {};

  errors.forEach(({ constraints }) => {
    if (constraints) {
      Object.entries(constraints).forEach(([type, value]) => {
        if (result[type]) {
          result[type].push(value);
        } else {
          result[type] = [value];
        }
      });
    }
  });

  return result;
};
