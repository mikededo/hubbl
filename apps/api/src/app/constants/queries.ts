/**
 * Result returned with the MAX_CONCURRENT_EVENTS_DAY
 */
export type MaxConcurentEventsResult = { max: number };

/**
 * Checks how many concurrent events exist
 */
export const MAX_CONCURRENT_EVENTS_DAY = [
  'WITH count AS (',
  'SELECT start_time AS enter_time, 1 AS inc',
  'FROM calendar_appointment',
  'WHERE date_year = $1',
  'AND date_month = $2',
  'AND date_day = $3',
  'AND start_time >= $4',
  'AND end_time <= $5',
  'AND calendar_id = $6',
  'AND cancelled = false',
  'UNION ALL',
  'SELECT end_time AS dte, -1 AS inc',
  'FROM calendar_appointment',
  'WHERE date_year = $1',
  'AND date_month = $2',
  'AND date_day = $3',
  'AND start_time >= $4',
  'AND end_time <= $5',
  'AND calendar_id = $6',
  'AND cancelled = false)',
  'SELECT COALESCE(MAX(concurrent), 0) as max',
  'FROM (SELECT enter_time, SUM(SUM(inc)) OVER (ORDER BY enter_time) AS concurrent',
  'FROM count',
  'GROUP BY enter_time',
  ') AS max_concurrent'
].join(' ');

export type AvailableTimesAppointmentsResult = { available: string }[];

/**
 * Query to fetch the available start times to create
 * a calendar appointment.
 * `$1` -> year of the date to search for
 * `$2` -> month of the date to search for
 * `$3` -> day of the date to search for
 * `$4` -> identifier of the calendar
 * `$5` -> intervals to which search (has to be in postgres interval
 * format)
 */
export const AVAILABLE_TIMES_APPOINTMENTS = [
  'WITH time_list AS (',
  'SELECT time_item',
  'FROM GENERATE_SERIES(',
  "TO_TIMESTAMP('00:00:00', 'HH24:MI:SS'),",
  "TO_TIMESTAMP('23:45:00', 'HH24:MI:SS'),",
  "'15 minutes'::INTERVAL) time_item),",
  'appointments_count AS (',
  'SELECT time_item::TIMESTAMP AS ti, COUNT(1) AS tic',
  'FROM time_list,',
  'calendar_appointment ca',
  'LEFT JOIN gym_zone gz ON gz.calendar_id = ca.id',
  'WHERE time_item::TIME BETWEEN ca.start_time AND ca.end_time',
  'AND ca.cancelled = false',
  'AND ca.date_year = $1',
  'AND ca.date_month = $2',
  'AND ca.date_day = $3',
  'AND ca.calendar_id = $4',
  'GROUP BY time_item)',
  'SELECT time_item::time as available',
  'FROM time_list,',
  'gym_zone gz',
  'WHERE gz.calendar_id = $4',
  'AND ((SELECT COUNT(*)',
  'FROM appointments_count',
  'WHERE ti > time_item',
  'AND ti < (time_item + $5)',
  'AND tic >= gz.capacity)) = 0',
  'AND time_item::TIME >= gz.open_time',
  'AND (time_item + $5)::TIME <= gz.close_time',
  'AND (time_item + $5)::TIME > time_item::TIME;'
].join(' ');
