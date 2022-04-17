import { EventDTO } from '@hubbl/shared/models/dto';
import { Divider, Stack, styled, Typography } from '@mui/material';

import ContentCard from '../ContentCard';
import TodayEventsListItem from '../TodayEventsListItem';

const Wrapper = styled(ContentCard)(({ theme }) => ({
  width: theme.spacing(44),
  overflow: 'hidden',
  maxHeight: `calc(100vh - ${theme.spacing(20.5)})`
}));

const PaddedStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  height: '100%',
  overflow: 'auto'
}));

const EmptyText = styled(Typography)({ textAlign: 'center', margin: 'auto' });

export type TodayEventsListProps = {
  /**
   * List of events to display. If empty will display
   * an empty message
   */
  events: EventDTO[];
};

const TodayEventsList = ({ events }: TodayEventsListProps): JSX.Element => (
  <Wrapper>
    <PaddedStack direction="column" gap={1.5}>
      <Typography variant="h5">Today's events</Typography>

      <Divider />

      {events.length ? (
        events.map((event) => <TodayEventsListItem event={event} />)
      ) : (
        <EmptyText textAlign="center" margin="auto">
          There are no event's left for today!
        </EmptyText>
      )}
    </PaddedStack>
  </Wrapper>
);

export default TodayEventsList;
