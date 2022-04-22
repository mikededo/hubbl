import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { PersonFormFields } from '../../types';
import PersonEmail from './PersonEmail';

const Component = () => (
  <FormProvider {...useForm<PersonFormFields>()}>
    <PersonEmail />
  </FormProvider>
);

describe('<PersonEmail />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('person-email')).toBeInTheDocument();
  });
});
