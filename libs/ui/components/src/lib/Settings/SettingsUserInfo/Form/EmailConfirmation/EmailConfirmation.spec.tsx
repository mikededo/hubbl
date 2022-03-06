import { render, screen } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';

import EmailConfirmation from './EmailConfirmation';

describe('<EmailConfirmation />', () => {
  const registerSpy = jest.fn();
  const mockFormState = { errors: {} };
  const mockGetValues = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(
      <FormProvider
        {...({
          register: registerSpy,
          formState: mockFormState,
          getValues: mockGetValues
        } as any)}
      >
        <EmailConfirmation />
      </FormProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should register the field', () => {
    mockGetValues.mockReturnValue('equal');
    registerSpy.mockImplementation((key, options) => {
      expect(key).toBe('emailConfirmation');

      expect(options.required).toBeTruthy();
      expect(options.validate).toBeDefined();

      // Should return false since the value is not equal
      expect(options.validate('non-equal')).toBeFalsy();
      // Should return false since the value is equal
      expect(options.validate('equal')).toBeTruthy();
      // Should compare with email field
      expect(mockGetValues).toHaveBeenCalledWith('email');
    });

    render(
      <FormProvider
        {...({
          register: registerSpy,
          formState: mockFormState,
          getValues: mockGetValues
        } as any)}
      >
        <EmailConfirmation />
      </FormProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
  });

  describe('disabled', () => {
    it('should be disabled', () => {
      mockGetValues.mockReturnValue('equal');
      registerSpy.mockImplementation(() => {
        // Empty
      });

      render(
        <FormProvider
          {...({
            register: registerSpy,
            formState: mockFormState,
            getValues: mockGetValues
          } as any)}
        >
          <EmailConfirmation disabled />
        </FormProvider>
      );

      expect(screen.getByPlaceholderText('Repeat the email')).toBeDisabled();
    });
  });
});
