import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneCapacity from './GymZoneCapacity';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneCapacity />
  </FormProvider>
);

describe('<GymZoneCapacity />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-capacity')).toBeInTheDocument();
  });
});
