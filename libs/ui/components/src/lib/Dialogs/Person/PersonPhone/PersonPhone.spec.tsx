import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import PersonPhone from './PersonPhone';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <PersonPhone />
  </FormProvider>
);

describe('<PersonPhone />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('person-phone')).toBeInTheDocument();
  });
});
