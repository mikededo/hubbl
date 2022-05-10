import { FormProvider, useForm } from 'react-hook-form';

import { GymZoneIntervals } from '@hubbl/shared/types';
import { render } from '@testing-library/react';

import { CalendarAppointmentFormFields } from '../../types';
import CalendarAppointmentInterval from './CalendarAppointmentInterval';

const Component = () => {
  const methods = useForm<CalendarAppointmentFormFields>({
    defaultValues: { interval: GymZoneIntervals.HOUR }
  });

  return (
    <FormProvider {...methods}>
      <CalendarAppointmentInterval />
    </FormProvider>
  );
};

describe('<CalendarAppointmentInterval />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
  });
});
