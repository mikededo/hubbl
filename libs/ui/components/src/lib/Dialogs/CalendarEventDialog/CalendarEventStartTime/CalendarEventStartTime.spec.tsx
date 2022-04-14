import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventStartTime from './CalendarEventStartTime';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventStartTime />
  </FormProvider>
);

describe('<CalendarEventStartTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-start-time')).toBeInTheDocument();
  });
});
