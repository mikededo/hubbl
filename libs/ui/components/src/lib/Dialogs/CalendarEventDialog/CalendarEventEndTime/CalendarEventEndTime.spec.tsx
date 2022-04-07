import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventEndTime from './CalendarEventEndTime';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventEndTime />
  </FormProvider>
);

describe('<CalendarEventEndTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-end-time')).toBeInTheDocument();
  });
});
