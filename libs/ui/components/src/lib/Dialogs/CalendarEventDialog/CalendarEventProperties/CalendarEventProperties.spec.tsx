import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventProperties from './CalendarEventProperties';

const Component = ({ watch }: { watch: any }) => (
  <FormProvider {...useForm<CalendarEventFormFields>()}>
    <CalendarEventProperties watch={watch} />
  </FormProvider>
);

describe('<CalendarEventProperties />', () => {
  it('should render properly', () => {
    const watch = () => null;
    const { container } = render(<Component watch={watch} />);

    expect(container).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-event-mask-required')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-event-covid-passport')
    ).toBeInTheDocument();
  });

  it('should render disabled', () => {
    const watch = () => 1;
    const { container } = render(<Component watch={watch} />);

    expect(container).toBeInTheDocument();
    expect(
      screen.getByTitle('calendar-event-mask-required').firstChild
    ).toBeDisabled();
    expect(
      screen.getByTitle('calendar-event-covid-passport').firstChild
    ).toBeDisabled();
  });
});
