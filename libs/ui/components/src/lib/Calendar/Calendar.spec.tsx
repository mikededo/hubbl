import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import Calendar from './Calendar';

const events = [
  {
    id: 1,
    name: 'EventOne',
    description: 'EventOne description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '12:00:00',
    eventType: { id: 1, labelColor: AppPalette.RED },
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    },
    appointmentCount: 1
  },
  {
    id: 2,
    name: 'EventTwo',
    description: 'EventTwo description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '7:00:00',
    eventType: { id: 2, labelColor: AppPalette.EMERALD },
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getDate()
    },
    appointmentCount: 2
  },
  {
    id: 3,
    name: 'EventThree',
    description: 'EventThree description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '7:00:00',
    endTime: '8:30:00',
    eventType: { id: 3, labelColor: AppPalette.BLUE },
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getDate()
    },
    appointmentCount: 3
  },
  {
    id: 4,
    name: 'EventFour',
    description: 'EventFour description',
    capacity: 5,
    covidPassport: true,
    maskRequired: true,
    difficulty: 3,
    startTime: '9:00:00',
    endTime: '10:00:00',
    eventType: { id: 4, labelColor: AppPalette.PURPLE },
    calendar: 5,
    date: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 3).getDate()
    },
    appointmentCount: 4
  }
];

describe('<Calendar />', () => {
  it('should render properly', () => {
    const { container } = render(
      <Calendar events={events as any} initialHour={6} finalHour={17} />
    );

    expect(container).toBeInTheDocument();
    // Find events
    events.forEach((e) => {
      expect(screen.getByText(e.name)).toBeInTheDocument();
      expect(
        screen.getByText(`${e.appointmentCount}/${e.capacity}`)
      ).toBeInTheDocument();
    });
  });

  describe('currentWeek', () => {
    it.each([
      { day: 1, name: 'Monday' },
      { day: 2, name: 'Tuesday' },
      { day: 3, name: 'Wednesday' },
      { day: 4, name: 'Thursday' },
      { day: 5, name: 'Friday' },
      { day: 6, name: 'Saturday' },
      { day: 0, name: 'Sunday' }
    ])('should render each day as selected ($day)', ({ day, name }) => {
      // 01/01/2018 was a monday
      jest
        .useFakeTimers()
        .setSystemTime(new Date(`2018-01-0${day === 0 ? 7 : day}`));

      const theme = createTheme();

      render(
        <ThemeProvider theme={theme}>
          <Calendar events={[]} initialHour={8} finalHour={17} currentWeek />
        </ThemeProvider>
      );

      expect(screen.getByText(name)).toHaveStyle({
        color: theme.palette.primary.main
      });
    });
  });

  describe('onSpotClick', () => {
    it('should call onSpotClick with the hour and the day', () => {
      const onClickSpy = jest.fn();

      render(
        <Calendar
          events={[]}
          initialHour={8}
          finalHour={17}
          onSpotClick={onClickSpy}
        />
      );
      fireEvent.click(screen.getAllByTestId('calendar-spot')[0]);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith({ hour: 8, day: 1 });
    });
  });
});
