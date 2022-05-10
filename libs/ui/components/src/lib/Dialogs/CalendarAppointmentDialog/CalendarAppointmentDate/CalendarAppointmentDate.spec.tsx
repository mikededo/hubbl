import { FormProvider, useForm } from 'react-hook-form';

import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarAppointmentDate from './CalendarAppointmentDate';

const MockComponent = ({
  defaultValues
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { trainer: defaultValues?.trainer ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <CalendarAppointmentDate />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<CalendarAppointmentDate />', () => {
  it('should render properly', () => {
    render(<MockComponent />);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByTitle('calendar-appointment-date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('dd/mm/yyyy')).toBeInTheDocument();
  });
});
