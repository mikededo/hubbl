import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import VirtualGymName from './VirtualGymName';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <VirtualGymName />
  </FormProvider>
);

describe('<VirtualGymName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('virtual-gym-name')).toBeInTheDocument();
  });
});
