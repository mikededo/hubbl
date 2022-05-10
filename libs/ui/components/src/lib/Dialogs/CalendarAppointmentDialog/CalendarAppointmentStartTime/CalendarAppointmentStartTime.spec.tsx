import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarAppointmentFormFields } from '../../types';
import CalendarAppointmentStartTime from './CalendarAppointmentStartTime';

const times = [
  '09:00:00',
  '09:15:00',
  '09:30:00',
  '09:45:00',
  '10:00:00',
  '10:15:00',
  '10:30:00',
  '10:45:00',
  '11:00:00',
  '11:15:00',
  '11:30:00',
  '11:45:00'
];

const splitTime = (time: string) => time.split(':').slice(0, 2).join(':');

const Component = ({
  defaultValues,
  times
}: {
  defaultValues?: object;
  times?: string[];
}) => {
  const methods = useForm<CalendarAppointmentFormFields>({ defaultValues });

  return (
    <FormProvider {...methods}>
      <CalendarAppointmentStartTime times={times} />
    </FormProvider>
  );
};

describe('<CalendarAppointmentStartTime />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
  });

  it('should display all the times in the dropdown', () => {
    // It will set time to 00:00
    jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));

    render(<Component times={times} />);
    fireEvent.mouseDown(screen.getByRole('button'));

    times.forEach((time) => {
      expect(
        screen.getByRole('option', { name: splitTime(time) })
      ).toBeInTheDocument();
    });
  });

  it('should display the filtered times in the dropdown', () => {
    const today = new Date();
    today.setHours(10);
    today.setMinutes(15);
    jest.useFakeTimers().setSystemTime(today);

    render(<Component times={times} />);
    fireEvent.mouseDown(screen.getByRole('button'));

    times.slice(times.length / 2).forEach((time) => {
      expect(
        screen.getByRole('option', { name: splitTime(time) })
      ).toBeInTheDocument();
    });
  });

  it('should use default value', () => {
    render(
      <Component
        defaultValues={{ startTime: splitTime(times[times.length / 2]) }}
        times={times}
      />
    );

    expect(
      screen.getByText(splitTime(times[times.length / 2]))
    ).toBeInTheDocument();
  });
});
