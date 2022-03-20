import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import VirtualGymPhone from './VirtualGymPhone';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <VirtualGymPhone />
  </FormProvider>
);

describe('<VirtualGymPhone />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('virtual-gym-phone')).toBeInTheDocument();
  });
});
