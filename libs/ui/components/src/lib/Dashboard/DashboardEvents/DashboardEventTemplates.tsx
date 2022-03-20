import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Grid, Stack, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../../AddItemPlaceholder';
import { DashboardEventTemplate } from '../DashboardEvent';

export type DashboardEventsProps = {
  /**
   * List of `EventTemplate`'s to display
   */
  items: EventTemplateDTO[];

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddEventTemplate?: EmptyHandler;
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardEvents = ({
  items,
  onAddEventTemplate
}: DashboardEventsProps) => (
  <Stack gap={4}>
    <Typography variant="h5">EVENT TEMPLATES</Typography>

    <Stack direction="column" gap={2}>
      {items.slice(0, Math.min(items.length, 5)).map((event) => (
        <Grid key={event.id} item>
          <DashboardEventTemplate event={event} />
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder
          title="add-event-template"
          height={7}
          width={44}
          onClick={onAddEventTemplate}
        >
          <PlaceholderText variant="placeholder">
            Click me to create a new event template!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </Stack>
  </Stack>
);

export default DashboardEvents;
