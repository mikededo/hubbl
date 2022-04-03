import { useMemo } from 'react';

import { EventDTO } from '@hubbl/shared/models/dto';
import { Hour } from '@hubbl/shared/types';

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

export type CalendarProps = {
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
};

const Calendar = ({
  events,
  initialHour,
  finalHour
}: CalendarProps): JSX.Element => {
  const filteredEvents = useMemo<FilteredEvents>(() => {
    const today = new Date();

    return events.reduce<FilteredEvents>(
      (prev, e) => {
        const diff =
          new Date(e.date.year, e.date.month - 1, e.date.day).getDate() -
          today.getDate();

        prev[diff].push(e);

        return prev;
      },
      [[], [], [], [], [], [], []]
    );
  }, [events]);

  return (
    <CalendarWeek>
      <CalendarDay
        day="Monday"
        events={filteredEvents[0]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 1}
      />

      <CalendarDay
        day="Tuesday"
        events={filteredEvents[1]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 2}
      />

      <CalendarDay
        day="Wednesday"
        events={filteredEvents[2]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 3}
      />

      <CalendarDay
        day="Tuesday"
        events={filteredEvents[3]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 4}
      />

      <CalendarDay
        day="Friday"
        events={filteredEvents[4]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 5}
      />

      <CalendarDay
        day="Saturday"
        events={filteredEvents[5]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 6}
      />

      <CalendarDay
        day="Sunday"
        events={filteredEvents[6]}
        finalHour={finalHour}
        initialHour={initialHour}
        today={new Date().getDay() === 0}
      />
    </CalendarWeek>
  );
};

export default Calendar;
