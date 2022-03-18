import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { VirtualGymFormFields } from '../../types';
import VirtualGymOpenTime from './VirtualGymOpenTime';

const Component = () => (
  <FormProvider {...useForm<VirtualGymFormFields>()}>
    <VirtualGymOpenTime />
  </FormProvider>
);

describe('<VirtualGymOpenTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('virtual-gym-open-time')).toBeInTheDocument();
  });
});
