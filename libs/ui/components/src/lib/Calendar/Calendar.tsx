import { memo, useMemo } from 'react';

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
   * Whether the week that is being displayed is a past
   * week
   *
   * @default false
   */
  pastWeek?: boolean;

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
   * Callback to run when an event of the calendar has been clicked. It
   * only works with non disabled days.
   *
   * @default undefined
   */
  onEventClick?: SingleHandler<EventDTO>;

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
  pastWeek,
  events,
  initialHour,
  finalHour,
  onEventClick,
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

  const today = new Date();

  return (
    <CalendarWeek title="calendar">
      <CalendarDay
        day="Monday"
        events={filteredEvents[1]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 1 && currentWeek}
        disabled={pastWeek || (today.getDay() > 1 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(1)}
      />

      <CalendarDay
        day="Tuesday"
        events={filteredEvents[2]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 2 && currentWeek}
        disabled={pastWeek || (today.getDay() > 2 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(2)}
      />

      <CalendarDay
        day="Wednesday"
        events={filteredEvents[3]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 3 && currentWeek}
        disabled={pastWeek || (today.getDay() > 3 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(3)}
      />

      <CalendarDay
        day="Thursday"
        events={filteredEvents[4]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 4 && currentWeek}
        disabled={pastWeek || (today.getDay() > 4 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(4)}
      />

      <CalendarDay
        day="Friday"
        events={filteredEvents[5]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 5 && currentWeek}
        disabled={pastWeek || (today.getDay() > 5 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(5)}
      />

      <CalendarDay
        day="Saturday"
        events={filteredEvents[6]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 6 && currentWeek}
        disabled={pastWeek || (today.getDay() === 0 && currentWeek)}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(6)}
      />

      <CalendarDay
        day="Sunday"
        events={filteredEvents[0]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={today.getDay() === 0 && currentWeek}
        disabled={pastWeek}
        disabledSpot={!onSpotClick}
        onEventClick={onEventClick}
        onSpotClick={handleOnSpotClick(0)}
      />
    </CalendarWeek>
  );
};

export default memo(Calendar);
