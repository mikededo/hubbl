import { render } from '@testing-library/react';
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
      <FormProvider
        {...({
          register: registerSpy,
          formState: mockFormState
        } as any)}
      >
        <Phone />
      </FormProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should register the field', () => {
    render(
      <FormProvider
        {...({
          register: registerSpy,
          formState: mockFormState
        } as any)}
      >
        <Phone />
      </FormProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('phone');
  });
});
