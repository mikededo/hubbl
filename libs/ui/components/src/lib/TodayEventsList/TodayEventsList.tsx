import { useState } from 'react';

import { motion } from 'framer-motion';

import { EventDTO } from '@hubbl/shared/models/dto';
import { ChevronRight } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  PaperProps,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';

import ContentCard from '../ContentCard';
import TodayEventsListItem from '../TodayEventsListItem';

const AnimatedWrapper = styled(motion.div)<PaperProps>(({ theme }) => ({
  width: theme.spacing(44),
  height: `calc(100vh - ${theme.spacing(20.5)})`,
  position: 'fixed',
  right: theme.spacing(4),
  top: theme.spacing(16.5),
  zIndex: theme.zIndex.drawer,
  [theme.breakpoints.down('md')]: { right: theme.spacing(-12) }
}));

const Wrapper = styled(ContentCard)<PaperProps>(({ theme }) => ({
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  zIndex: theme.zIndex.drawer
}));

const IconContentCard = styled(ContentCard)(({ theme }) => ({
  transform: `translateY(${theme.spacing(-8)})`,
  padding: 0,
  height: theme.spacing(6),
  width: theme.spacing(6),
  right: theme.spacing(4),
  top: theme.spacing(16.5),
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.3s right cubic-bezier(0.47, 1.64, 0.41, 0.8)',
  [theme.breakpoints.down('md')]: { right: theme.spacing(-12) }
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

const TodayEventsList = ({ events }: TodayEventsListProps): JSX.Element => {
  const theme = useTheme();

  const [hidden, setHidden] = useState(false);

  const handleOnToggleHidden = () => {
    setHidden((prev) => !prev);
  };

  return (
    <>
      <IconContentCard>
        <motion.span
          animate={{
            transform: `rotate(${hidden ? '0deg' : '180deg'})`
          }}
        >
          <Tooltip title={`${hidden ? 'Show' : 'Hide'} today events`}>
            <IconButton
              aria-label={`${hidden ? 'show' : 'hide'}-events-list`}
              onClick={handleOnToggleHidden}
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </motion.span>
      </IconContentCard>

      <AnimatedWrapper
        animate={{ right: theme.spacing(!hidden ? 3 : -60) }}
        transition={{ type: 'spring', stiffness: 700, damping: 50 }}
      >
        <Wrapper>
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
        </Wrapper>
      </AnimatedWrapper>
    </>
  );
};

export default TodayEventsList;
