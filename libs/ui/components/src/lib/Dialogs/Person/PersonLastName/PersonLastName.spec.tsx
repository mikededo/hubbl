import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { PersonFormFields } from '../../types';
import PersonLastName from './PersonLastName';

const Component = () => (
  <FormProvider {...useForm<PersonFormFields>()}>
    <PersonLastName />
  </FormProvider>
);

describe('<PersonLastName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('person-last-name')).toBeInTheDocument();
  });
});
