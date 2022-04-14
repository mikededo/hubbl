import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import CalendarEvent, { CalendarEventProps } from './CalendarEvent';

const event = {
  id: 1,
  name: 'Event One',
  capacity: 5,
  difficulty: 3,
  startTime: '6:00:00',
  endTime: '12:00:00',
  calendar: 5,
  date: {
    year: 2022,
    month: 2,
    day: 18
  },
  appointmentCount: 3,
  eventType: { id: 1, labelColor: AppPalette.RED }
};

const Component = (props: CalendarEventProps): JSX.Element => (
  <ThemeProvider theme={createTheme()}>
    <CalendarEvent {...props} />
  </ThemeProvider>
);

describe('<CalendarEvent />', () => {
  it('should render properly', () => {
    const { container } = render(
      <Component event={event as any} index={0} initialDayHour={8} />
    );

    expect(container).toBeInTheDocument();
    // Find event fields
    expect(screen.getByText(event.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${event.appointmentCount}/${event.capacity}`)
    ).toBeInTheDocument();
  });

  it('should render the event well positioned styles', () => {
    const { container } = render(
      <Component event={event as any} index={0} initialDayHour={8} />
    );

    expect(container).toHaveStyle({
      height: 6 * 8 - 1,
      top: 6 * 8 + 6 + 0.5
    });
  });

  it('should only render the name', () => {
    render(
      <Component
        event={{ ...event, endTime: '06:30:00' } as any}
        index={0}
        initialDayHour={8}
      />
    );

    expect(
      screen.queryByText(`${event.appointmentCount}/${event.capacity}`)
    ).not.toBeInTheDocument();
  });

  describe('onClick', () => {
    it('should call onClick if event clicked', () => {
      const onClickSpy = jest.fn();

      const { container } = render(
        <Component
          event={event as any}
          index={0}
          initialDayHour={8}
          onClick={onClickSpy}
        />
      );
      fireEvent.click(container.firstChild as ChildNode);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(event);
    });

    it('should not call onClick if event is disabled', () => {
      const onClickSpy = jest.fn();

      const { container } = render(
        <Component
          event={event as any}
          index={0}
          initialDayHour={8}
          onClick={onClickSpy}
          disabled
        />
      );
      fireEvent.click(container.firstChild as ChildNode);

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });
  });
});
