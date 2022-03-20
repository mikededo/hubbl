import { EventDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Grid, Stack, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../../AddItemPlaceholder';
import { DashboardEvent } from '../DashboardEvent';

export type DashboardEventsProps = {
  /**
   * List of `Event`'s to display
   */
  items: EventDTO[];

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddEvent?: EmptyHandler;
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardEvents = ({ items, onAddEvent }: DashboardEventsProps) => (
  <Stack gap={4}>
    <Typography variant="h5">EVENTS</Typography>

    <Stack direction="column" gap={2}>
      {items.slice(0, Math.min(items.length, 5)).map((event) => (
        <Grid key={event.id} item>
          <DashboardEvent event={event} />
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder
          title="add-event"
          height={7}
          width={44}
          onClick={onAddEvent}
        >
          <PlaceholderText variant="placeholder">
            Click me to create a new event!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </Stack>
  </Stack>
);

export default DashboardEvents;
