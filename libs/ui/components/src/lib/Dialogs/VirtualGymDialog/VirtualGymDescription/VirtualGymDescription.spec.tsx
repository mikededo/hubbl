import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import VirtualGymDescription from './VirtualGymDescription';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <VirtualGymDescription />
  </FormProvider>
);

describe('<VirtualGymDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('virtual-gym-description')).toBeInTheDocument();
  });
});
