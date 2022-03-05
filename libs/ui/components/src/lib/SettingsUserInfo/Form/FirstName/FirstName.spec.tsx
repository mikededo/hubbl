import { render } from '@testing-library/react';
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
      <FormProvider
        {...({
          register: registerSpy,
          formState: mockFormState
        } as any)}
      >
        <FirstName />
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
        <FirstName />
      </FormProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('firstName', { required: true });
  });
});
