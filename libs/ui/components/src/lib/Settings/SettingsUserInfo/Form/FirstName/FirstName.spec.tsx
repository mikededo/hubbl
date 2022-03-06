import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';

import FirstName from './FirstName';

describe('<FirstName />', () => {
  const registerSpy = jest.fn();
  const mockFormState = { errors: {} };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <FormProvider
          {...({
            register: registerSpy,
            formState: mockFormState
          } as any)}
        >
          <FirstName />
        </FormProvider>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should register the field', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <FormProvider
          {...({
            register: registerSpy,
            formState: mockFormState
          } as any)}
        >
          <FirstName />
        </FormProvider>
      </ThemeProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('firstName', { required: true });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <FormProvider
            {...({
              register: registerSpy,
              formState: mockFormState
            } as any)}
          >
            <FirstName disabled />
          </FormProvider>
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('John')).toBeDisabled();
    });
  });
});
