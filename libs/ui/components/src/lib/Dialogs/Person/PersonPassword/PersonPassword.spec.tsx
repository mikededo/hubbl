import { FormProvider, useForm } from 'react-hook-form';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { PersonFormFields } from '../../types';
import PersonPassword from './PersonPassword';

const Component = () => (
  <FormProvider {...useForm<PersonFormFields>()}>
    <PersonPassword />
  </FormProvider>
);

describe('<PersonPassword />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('person-password')).toBeInTheDocument();
  });

  it('should change the visibility of the inputs', async () => {
    render(<Component />);

    expect(
      screen.getByPlaceholderText('At least 8 characters!')
    ).toHaveAttribute('type', 'password');
    await act(async () => {
      fireEvent.click(screen.getByLabelText('password visibility'));
    });
  });
});
