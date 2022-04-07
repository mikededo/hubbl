import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventProperties from './CalendarEventProperties';

const Component = () => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventProperties />
  </FormProvider>
);

describe('<CalendarEventProperties />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-event-mask-required')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-event-covid-passport')
    ).toBeInTheDocument();
  });
});
