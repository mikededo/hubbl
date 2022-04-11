import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventCapacity from './CalendarEventCapacity';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventCapacity />
  </FormProvider>
);

describe('<CalendarEventCapacity />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-capacity')).toBeInTheDocument();
  });
});
