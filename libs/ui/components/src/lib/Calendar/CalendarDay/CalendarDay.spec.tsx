import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import CalendarDay, { CalendarDayProps } from './CalendarDay';

const events = [
  {
    id: 1,
    name: 'Event One',
    capacity: 5,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '12:00:00',
    color: AppPalette.RED,
    calendar: 5,
    date: {
      year: 2022,
      month: 2,
      day: 18
    },
    appointmentCount: 0
  },
  {
    id: 2,
    name: 'Event Three',
    capacity: 5,
    difficulty: 3,
    startTime: '6:00:00',
    endTime: '7:00:00',
    color: AppPalette.EMERALD,
    calendar: 5,
    date: {
      year: 2022,
      month: 2,
      day: 19
    },
    appointmentCount: 0
  },
  {
    id: 3,
    name: 'Event Four',
    capacity: 5,
    difficulty: 3,
    startTime: '7:00:00',
    endTime: '8:30:00',
    color: AppPalette.BLUE,
    calendar: 5,
    date: {
      year: 2022,
      month: 2,
      day: 19
    },
    appointmentCount: 0
  },
  {
    id: 4,
    name: 'Event Five',
    capacity: 5,
    difficulty: 3,
    startTime: '9:00:00',
    endTime: '10:00:00',
    color: AppPalette.PURPLE,
    calendar: 5,
    date: {
      year: 2022,
      month: 2,
      day: 19
    },
    appointmentCount: 0
  }
];

const Component = (props: CalendarDayProps): JSX.Element => (
  <ThemeProvider theme={createTheme()}>
    <CalendarDay {...props} />
  </ThemeProvider>
);

describe('<CalendarDay />', () => {
  it.each([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ])('should render %s day properly', (day) => {
    const utils = render(
      <Component day={day as any} initialHour={8} finalHour={17} />
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText(day));
  });

  it('should render the day with selected styles', () => {
    render(<Component day="Monday" initialHour={8} finalHour={17} today />);

    expect(screen.getByText('Monday')).toHaveStyle(
      `color: ${createTheme().palette.primary.main}`
    );
  });

  it('should render the list of events', () => {
    render(
      <Component
        day="Monday"
        events={events as any}
        initialHour={8}
        finalHour={17}
        today
      />
    );

    events.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('onSpotClick', () => {
    it('should call onSpotClick with the hour of the spot', () => {
      const onClickSpy = jest.fn();

      render(
        <Component
          day="Monday"
          events={[]}
          initialHour={8}
          finalHour={17}
          onSpotClick={onClickSpy}
        />
      );
      fireEvent.click(screen.getAllByTestId('calendar-spot')[0]);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(8);
    });
  });
});
