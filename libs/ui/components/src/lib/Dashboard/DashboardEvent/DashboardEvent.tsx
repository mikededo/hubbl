import { EventDTO } from '@hubbl/shared/models/dto';
import { Stack, styled, Typography } from '@mui/material';

import ContentCard from '../../ContentCard';
import DashboardCommonEvent from './DashboardCommonEvent';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  width: theme.spacing(44),
  height: theme.spacing(10)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type DashboardEventProps = {
  /**
   * `Event` to display to the screen
   */
  event: EventDTO;
};

const DashboardEvent = ({ event }: DashboardEventProps): JSX.Element => (
  <PaddedContentCard>
    <ContentStack justifyContent="space-between">
      <DashboardCommonEvent event={event} />

      <Stack direction="row" justifyContent="space-between">
        <Typography>
          {event.date.day}/{`${event.date.month}`.padStart(2, '0')}/
          {event.date.year}
        </Typography>

        <Typography>
          {event.startTime}-{event.endTime}
        </Typography>
      </Stack>
    </ContentStack>
  </PaddedContentCard>
);

export default DashboardEvent;
