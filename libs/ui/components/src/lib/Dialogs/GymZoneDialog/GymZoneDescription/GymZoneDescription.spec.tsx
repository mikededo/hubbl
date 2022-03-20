import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneDescription from './GymZoneDescription';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneDescription />
  </FormProvider>
);

describe('<GymZoneDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-description')).toBeInTheDocument();
  });
});
