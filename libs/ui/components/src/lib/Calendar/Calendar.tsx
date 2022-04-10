import { useMemo } from 'react';

import { EventDTO } from '@hubbl/shared/models/dto';
import { Hour, SingleHandler } from '@hubbl/shared/types';

import CalendarDay from './CalendarDay';
import CalendarWeek from './CalendarWeek';

type FilteredEvents = [
  // Monday events
  EventDTO[],
  // Tuesday events
  EventDTO[],
  // Wednesday events
  EventDTO[],
  // Thursday events
  EventDTO[],
  // Friday events
  EventDTO[],
  // Saturday events
  EventDTO[],
  // Sunday events
  EventDTO[]
];

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type EventSpot = {
  /**
   * Hour of the spot that has been clicked
   */
  hour: number;

  /**
   * Day of the week of the clicked spot
   */
  day: WeekDay;
};

export type CalendarProps = {
  /**
   * Whether the week that is being displayed is the current
   * week
   *
   * @default false
   */
  currentWeek?: boolean;

  /**
   * List of events to display in the calenda
   */
  events: EventDTO[];

  /**
   * Initial hour of the calendar
   */
  initialHour: Hour;

  /**
   * Final hour of the calendar
   */
  finalHour: Hour;

  /**
   * Callback run when a spot of the calendar it is clicked. The day and
   * hour of the calendar is passed as props
   *
   * @default undefined
   */
  onSpotClick?: SingleHandler<EventSpot>;
};

const Calendar = ({
  currentWeek,
  events,
  initialHour,
  finalHour,
  onSpotClick
}: CalendarProps): JSX.Element => {
  const filteredEvents = useMemo<FilteredEvents>(
    () =>
      events.reduce<FilteredEvents>(
        (prev, e) => {
          const index = new Date(
            e.date.year,
            e.date.month - 1,
            e.date.day
          ).getDay();

          prev[index].push(e);

          return prev;
        },
        [[], [], [], [], [], [], []]
      ),
    [events]
  );

  const handleOnSpotClick: SingleHandler<WeekDay, SingleHandler<number>> =
    (day) => (hour) => {
      onSpotClick?.({ hour, day });
    };

  return (
    <CalendarWeek title="calendar">
      <CalendarDay
        day="Monday"
        events={filteredEvents[1]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 1 && currentWeek}
        onSpotClick={handleOnSpotClick(1)}
      />

      <CalendarDay
        day="Tuesday"
        events={filteredEvents[2]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 2 && currentWeek}
        onSpotClick={handleOnSpotClick(2)}
      />

      <CalendarDay
        day="Wednesday"
        events={filteredEvents[3]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 3 && currentWeek}
        onSpotClick={handleOnSpotClick(3)}
      />

      <CalendarDay
        day="Thursday"
        events={filteredEvents[4]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 4 && currentWeek}
        onSpotClick={handleOnSpotClick(4)}
      />

      <CalendarDay
        day="Friday"
        events={filteredEvents[5]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 5 && currentWeek}
        onSpotClick={handleOnSpotClick(5)}
      />

      <CalendarDay
        day="Saturday"
        events={filteredEvents[6]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 6 && currentWeek}
        onSpotClick={handleOnSpotClick(6)}
      />

      <CalendarDay
        day="Sunday"
        events={filteredEvents[0]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 0 && currentWeek}
        onSpotClick={handleOnSpotClick(0)}
      />
    </CalendarWeek>
  );
};

export default Calendar;
