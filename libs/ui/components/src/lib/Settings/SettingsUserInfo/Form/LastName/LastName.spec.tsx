import { FormProvider } from 'react-hook-form';

import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';

import LastName from './LastName';

describe('<LastName />', () => {
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
          <LastName />
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
          <LastName />
        </FormProvider>
      </ThemeProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('lastName', { required: true });
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
            <LastName disabled />
          </FormProvider>
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('Doe')).toBeDisabled();
    });
  });
});
