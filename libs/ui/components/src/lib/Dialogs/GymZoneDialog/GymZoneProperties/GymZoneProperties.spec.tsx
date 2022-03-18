import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneLocation from './GymZoneProperties';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneLocation />
  </FormProvider>
);

describe('<GymZoneLocation />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-class-type')).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-mask-required')).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-covid-passport')).toBeInTheDocument();
  });
});
