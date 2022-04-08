import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventDescription from './CalendarEventDescription';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventDescription />
  </FormProvider>
);

describe('<CalendarEventDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-description')).toBeInTheDocument();
  });
});
