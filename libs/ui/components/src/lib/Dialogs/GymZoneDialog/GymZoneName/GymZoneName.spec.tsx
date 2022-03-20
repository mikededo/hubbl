import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneName from './GymZoneName';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneName />
  </FormProvider>
);

describe('<GymZoneName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-name')).toBeInTheDocument();
  });
});
