import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { PersonFormFields } from '../../types';
import PersonFirstName from './PersonFirstName';

const Component = () => (
  <FormProvider {...useForm<PersonFormFields>()}>
    <PersonFirstName />
  </FormProvider>
);

describe('<PersonFirstName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('person-first-name')).toBeInTheDocument();
  });
});
