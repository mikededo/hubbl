import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventName from './CalendarEventName';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventName />
  </FormProvider>
);

describe('<CalendarEventName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-name')).toBeInTheDocument();
  });
});
