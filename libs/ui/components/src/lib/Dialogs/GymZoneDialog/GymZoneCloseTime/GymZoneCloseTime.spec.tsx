import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneCloseTime from './GymZoneCloseTime';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneCloseTime />
  </FormProvider>
);

describe('<GymZoneCloseTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-close-time')).toBeInTheDocument();
  });
});
