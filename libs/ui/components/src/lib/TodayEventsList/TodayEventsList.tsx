import { motion } from 'framer-motion';

import { EventDTO } from '@hubbl/shared/models/dto';
import { Divider, Stack, styled, Typography, useTheme } from '@mui/material';

import SideToggler from '../SideToggler';
import TodayEventsListItem from '../TodayEventsListItem';

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

const TodayEventsList = ({ events }: TodayEventsListProps): JSX.Element => {
  const theme = useTheme();

  return (
    <SideToggler showLabel="Show today events" hideLabel="hide today events">
      <PaddedStack direction="column" gap={1.5}>
        <Typography variant="h5">Today's events</Typography>

        <Divider />

        {events.length ? (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              style={{ overflow: 'hidden' }}
              initial={{ minHeight: theme.spacing(0) }}
              animate={{ minHeight: theme.spacing(9) }}
              exit={{ minHeight: theme.spacing(0) }}
              transition={{
                delay: 0.25 + index * 0.05,
                duration: 0.5,
                type: 'spring',
                damping: 50,
                stiffness: 700
              }}
            >
              <TodayEventsListItem event={event} />
            </motion.div>
          ))
        ) : (
          <EmptyText textAlign="center" margin="auto">
            There are no event's left for today!
          </EmptyText>
        )}
      </PaddedStack>
    </SideToggler>
  );
};

export default TodayEventsList;
