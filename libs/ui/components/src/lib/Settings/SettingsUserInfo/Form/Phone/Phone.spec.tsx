import { ThemeProvider, createTheme } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';

import Phone from './Phone';

describe('<Phone />', () => {
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
          <Phone />
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
          <Phone />
        </FormProvider>
      </ThemeProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('phone');
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
            <Phone disabled />
          </FormProvider>
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('000 000 000')).toBeDisabled();
    });
  });
});
