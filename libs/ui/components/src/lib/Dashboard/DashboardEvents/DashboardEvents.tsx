import { EventDTO } from '@hubbl/shared/models/dto';
import { Grid, Stack, Typography } from '@mui/material';

import { DashboardEvent } from '../DashboardEvent';

export type DashboardEventsProps = {
  /**
   * List of `Event`'s to display
   */
  items: EventDTO[];
};

const DashboardEvents = ({ items }: DashboardEventsProps): JSX.Element => (
  <Stack gap={4}>
    <Typography variant="h5">EVENTS</Typography>

    <Stack direction="column" gap={2}>
      {items.slice(0, Math.min(items.length, 5)).map((event) => (
        <Grid key={event.id} item>
          <DashboardEvent event={event} />
        </Grid>
      ))}
    </Stack>
  </Stack>
);

export default DashboardEvents;
