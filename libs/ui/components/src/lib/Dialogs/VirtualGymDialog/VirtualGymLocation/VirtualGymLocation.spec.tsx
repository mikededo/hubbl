import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import VirtualGymLocation from './VirtualGymLocation';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <VirtualGymLocation />
  </FormProvider>
);

describe('<VirtualGymLocation />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('virtual-gym-location')).toBeInTheDocument();
  });
});
