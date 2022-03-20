import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { GymZoneFormFields } from '../../types';
import GymZoneOpenTime from './GymZoneOpenTime';

const Component = () => (
  <FormProvider {...useForm<GymZoneFormFields>()}>
    <GymZoneOpenTime />
  </FormProvider>
);

describe('<GymZoneOpenTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('gym-zone-open-time')).toBeInTheDocument();
  });
});
