import { validationParser } from './validation-parser';

describe('validationParser', () => {
  it('should return an empty object', () => {
    const result = validationParser([]);

    expect(result).toStrictEqual({});
  });

  it('should return a list with the errors with constraints', () => {
    const errors = [
      { constraints: { isString: '[FieldOne] should be a string' } },
      {},
      { constraints: { isNumber: '[FieldTwo] should be a number' } }
    ] as any[];

    const result = validationParser(errors);

    expect(Object.keys(result).length).toBe(2);
    expect(result.isString).toBeDefined();
    expect(result.isNumber).toBeDefined();
  });

  it('should group messages if equal constraint', () => {
    const errors = [
      { constraints: { isString: '[FieldOne] should be a string' } },
      { constraints: { isString: '[FieldTwo] should be a string' } }
    ] as any[];

    const result = validationParser(errors);

    expect(Object.keys(result).length).toBe(1);
    expect(result.isString).toBeDefined();
    expect(result.isString.length).toBe(2);
  });

  it('should append the nested value string', () => {
    const errors = [
      { constraints: { isString: '[FieldOne] should be a string' } }
    ] as any[];

    const result = validationParser(errors, 'nested');

    expect(Object.keys(result).length).toBe(1);
    expect(result.isString).toBeDefined();
    expect(result.isString[0].match(/^(\[nested\.)+.*/g)).toBeTruthy();
  });
});
