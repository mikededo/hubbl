/**
 * Result returned with the MAX_CONCURRENT_EVENTS_DAY
 */
export type MaxConcurentEventsResult = { max: number };

/**
 * Checks how many concurrent events exist
 */
export const MAX_CONCURRENT_EVENTS_DAY = [
  'WITH count AS (',
  'SELECT start_time AS app_time, 1 AS inc',
  'FROM calendar_appointment',
  'WHERE date_year = $1',
  'AND date_month = $2',
  'AND date_day = $3',
  'AND start_time > $4',
  'AND end_time < $5',
  'AND calendar_id = $6',
  'UNION ALL',
  'SELECT end_time AS dte, -1 AS inc',
  'FROM calendar_appointment',
  'WHERE date_year = $1',
  'AND date_month = $2',
  'AND date_day = $3',
  'AND start_time > $4',
  'AND end_time < $5',
  'AND calendar_id = $6)',
  'SELECT max(concurrent)',
  'FROM (SELECT app_time, SUM(SUM(inc)) OVER (ORDER BY app_time) AS concurrent',
  'FROM count',
  'GROUP BY app_time',
  ') AS max_concurrent'
].join(' ');
